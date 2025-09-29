#!/bin/bash

set -euo pipefail

IMAGE_NAME=${IMAGE_NAME:-oplus-web}
CONTAINER_NAME=${CONTAINER_NAME:-oplus-web-test}
HOST_PORT=${HOST_PORT:-8080}
BACKEND_URL=${BACKEND_URL:-http://10.1.40.228:18030}

usage() {
    cat <<'USAGE'
Usage: ${0##*/} [options] [-- docker-run-extra-args]

Options:
  -i, --image NAME          Docker image repository to search (default: ${IMAGE_NAME})
  -c, --container NAME      Container name to use (default: ${CONTAINER_NAME})
  -p, --port PORT           Host port mapped to container 80 (default: ${HOST_PORT})
  -b, --backend-url URL     Backend URL to pass into the container (default: ${BACKEND_URL})
  -h, --help                Show this help message

Environment overrides:
  IMAGE_NAME, CONTAINER_NAME, HOST_PORT, BACKEND_URL

Additional docker run flags can be supplied after "--".
USAGE
}

extra_args=()
while [[ $# -gt 0 ]]; do
    case "$1" in
        -i|--image)
            IMAGE_NAME="$2"
            shift 2
            ;;
        -c|--container)
            CONTAINER_NAME="$2"
            shift 2
            ;;
        -p|--port)
            HOST_PORT="$2"
            shift 2
            ;;
        -b|--backend-url)
            BACKEND_URL="$2"
            shift 2
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        --)
            shift
            extra_args+=("$@")
            break
            ;;
        *)
            echo "Unknown option: $1" >&2
            usage >&2
            exit 1
            ;;
    esac
done

image_candidates=()
while IFS= read -r candidate; do
    image_candidates+=("$candidate")
done < <(docker images "$IMAGE_NAME" --format '{{.Repository}}:{{.Tag}}')

latest_image=""
for candidate in "${image_candidates[@]}"; do
    tag=${candidate#*:}
    if [[ "$tag" == "<none>" ]]; then
        continue
    fi
    if [[ -z "$latest_image" ]]; then
        latest_image="$candidate"
    fi
    if [[ "$candidate" != *-arm64 ]]; then
        latest_image="$candidate"
        break
    fi
done

if [[ -z "$latest_image" ]]; then
    echo "No built images found for repository '$IMAGE_NAME'." >&2
    echo "Please build the Docker image before running this script." >&2
    exit 1
fi

echo "Using image: $latest_image"
echo "Backend URL: $BACKEND_URL"

existing_container=$(docker ps -aq --filter "name=^${CONTAINER_NAME}$")
if [[ -n "$existing_container" ]]; then
    echo "Stopping existing container: $CONTAINER_NAME"
    docker rm -f "$CONTAINER_NAME" >/dev/null
fi

docker_args=(-d
    --name "$CONTAINER_NAME"
    -p "${HOST_PORT}:80"
    -e "BACKEND_URL=${BACKEND_URL}"
)

if [[ ${#extra_args[@]} -gt 0 ]]; then
    docker_args+=("${extra_args[@]}")
fi

docker_args+=("$latest_image")

docker run "${docker_args[@]}"

echo "Container '$CONTAINER_NAME' is running and mapped to http://localhost:${HOST_PORT}"
