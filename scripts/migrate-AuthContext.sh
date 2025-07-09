#!/bin/bash
# Migration script for src/components/AuthContext.ts
# Usage: ./migrate-AuthContext.sh migrate|rollback

SRC="/workspaces/Trade-Pro/src/components/AuthContext.ts"
DEST="/workspaces/Trade-Pro/src/context/AuthContext.ts"
TEMPLATE="/workspaces/Trade-Pro/scripts/migrate-and-rollback-template.sh"

if [[ ! -f "$TEMPLATE" ]]; then
  echo "Migration template not found: $TEMPLATE"
  exit 1
fi

$TEMPLATE $1 "$SRC" "$DEST"
