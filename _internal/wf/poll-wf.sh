#!/usr/bin/env bash
# Hang-detection poller for eat-ranking workflows (cafes/restaurants/attractions).
# Exits (which re-invokes the main loop reliably) when the workflow is DONE or STALLED.
# Usage: bash _internal/wf/poll-wf.sh <workflow-transcript-dir> [stall_secs] [max_secs]
WFDIR="$1"
STALL="${2:-780}"     # 13 min silence => stalled (hung or finished)
MAXRUN="${3:-3600}"   # hard cap 60 min => exit & re-check regardless
START=$(date +%s)
if [ -z "$WFDIR" ] || [ ! -d "$WFDIR" ]; then echo "POLLER: bad dir '$WFDIR'"; exit 2; fi
echo "POLLER: watching $WFDIR (stall=${STALL}s cap=${MAXRUN}s)"
while true; do
  sleep 90
  NOW=$(date +%s)
  # DONE: the script's return object (contains restaurantCount) got journaled anywhere in the dir
  if grep -rqsl "restaurantCount" "$WFDIR" 2>/dev/null; then
    echo "POLLER: DONE — 'restaurantCount' present in $WFDIR (elapsed $((NOW-START))s)"; exit 0
  fi
  # newest mtime across the dir
  NEWEST=$(find "$WFDIR" -type f -printf '%T@\n' 2>/dev/null | sort -nr | head -1 | cut -d. -f1)
  if [ -n "$NEWEST" ]; then
    SILENT=$((NOW-NEWEST))
    if [ "$SILENT" -ge "$STALL" ]; then
      echo "POLLER: STALLED — newest file silent ${SILENT}s (>=${STALL}s) in $WFDIR — likely hung or finished; re-check & RESUME if hung"; exit 0
    fi
  fi
  if [ $((NOW-START)) -ge "$MAXRUN" ]; then
    echo "POLLER: MAXRUN ${MAXRUN}s reached — exiting to re-check"; exit 0
  fi
done
