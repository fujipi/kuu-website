#!/usr/bin/env bash
#
# docs/branch-cleanup-2026-08-23.md の表に載っている残留ブランチを削除する。
#
#   ./scripts/delete-stale-branches.sh --dry-run   # 対象の確認のみ
#   ./scripts/delete-stale-branches.sh             # 実削除
#
# 表から「ブランチ名 + 記録時点の SHA」を読み、リモートの現在の SHA が記録と
# 一致するものだけを削除する。棚卸し後に push し直されたブランチはスキップして
# 報告するので、新しい作業を巻き込まない。
#
# 復元は  git push origin <SHA>:refs/heads/<ブランチ名>

set -uo pipefail

DOC="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/docs/branch-cleanup-2026-08-23.md"
REMOTE="${REMOTE:-origin}"
DRY_RUN=0
[ "${1:-}" = "--dry-run" ] && DRY_RUN=1

[ -f "$DOC" ] || { echo "記録ファイルが見つからない: $DOC" >&2; exit 1; }

# 表の各行: | `branch` | `sha` | ...
mapfile -t ROWS < <(grep -oE '^\| `[^`]+` \| `[0-9a-f]{40}`' "$DOC" |
                    sed -E 's/^\| `([^`]+)` \| `([0-9a-f]{40})`/\1 \2/')

[ "${#ROWS[@]}" -gt 0 ] || { echo "表から対象を読み取れなかった" >&2; exit 1; }
echo "記録上の対象: ${#ROWS[@]} 本"

echo "リモートの現状を取得中..."
declare -A LIVE=()
while read -r sha ref; do LIVE["${ref#refs/heads/}"]="$sha"; done \
  < <(git ls-remote --heads "$REMOTE")

TO_DELETE=(); GONE=0; MOVED=()
for row in "${ROWS[@]}"; do
  branch="${row% *}"; sha="${row##* }"
  case "$branch" in
    main|claude/cleanup-unused-branches-y532ew)
      echo "  保護: $branch をスキップ"; continue ;;
  esac
  live="${LIVE[$branch]:-}"
  if   [ -z "$live" ];        then GONE=$((GONE + 1))
  elif [ "$live" != "$sha" ]; then MOVED+=("$branch")
  else TO_DELETE+=("$branch")
  fi
done

[ "$GONE" -gt 0 ] && echo "  削除済み（対応不要）: $GONE 本"
if [ "${#MOVED[@]}" -gt 0 ]; then
  echo "  棚卸し後に更新されたためスキップ: ${#MOVED[@]} 本"
  printf '    - %s\n' "${MOVED[@]}"
fi

echo "削除対象: ${#TO_DELETE[@]} 本"
[ "${#TO_DELETE[@]}" -eq 0 ] && { echo "何もすることがない"; exit 0; }

if [ "$DRY_RUN" -eq 1 ]; then
  printf '  - %s\n' "${TO_DELETE[@]}"
  echo "(--dry-run のため削除していない)"
  exit 0
fi

FAILED=()
for ((i = 0; i < ${#TO_DELETE[@]}; i += 20)); do
  batch=("${TO_DELETE[@]:i:20}")
  echo "削除中: $((i + 1))-$((i + ${#batch[@]})) / ${#TO_DELETE[@]}"
  git push "$REMOTE" --delete "${batch[@]}" >/dev/null 2>&1 || FAILED+=("${batch[@]}")
done

if [ "${#FAILED[@]}" -gt 0 ]; then
  echo "一括削除に失敗した分を1本ずつ再試行: ${#FAILED[@]} 本"
  STILL=()
  for b in "${FAILED[@]}"; do
    git push "$REMOTE" --delete "$b" >/dev/null 2>&1 || STILL+=("$b")
  done
  if [ "${#STILL[@]}" -gt 0 ]; then
    echo "削除できなかった: ${#STILL[@]} 本" >&2
    printf '  - %s\n' "${STILL[@]}" >&2
    exit 1
  fi
fi

echo "完了。残りのリモートブランチ:"
git ls-remote --heads "$REMOTE" | sed 's|.*refs/heads/|  |'
