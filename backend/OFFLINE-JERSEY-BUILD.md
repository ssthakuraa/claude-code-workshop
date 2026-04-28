# Offline Jersey Build

The backend helper scripts no longer assume repo-owned runtime assets under `runtime/`.

Prerequisites:

- Java available through `JAVA_HOME` or `java` on `PATH`
- Maven available through `MVN_BIN` or `mvn` on `PATH`
- optional local Maven cache location through `MAVEN_REPO_LOCAL`

Important for this host:

- do not rely on the shell-default Java, which may still resolve to Java 8
- explicitly use JDK 21 for backend builds and runs
- preferred setting:

```bash
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
export PATH="$JAVA_HOME/bin:$PATH"
```

Helper scripts:

- `backend/cache-maven-repo.sh`
- `backend/build-jersey-service.sh`
- `backend/run-jersey-service.sh`
- `backend/stop-jersey-service.sh`
- `./start-hrlab-backend.sh`
- `./start-hrlab-frontend.sh`

## Build flow

Build the backend:

```bash
cd backend
./build-jersey-service.sh
```

Run the current Jersey foundation:

```bash
cd backend
./run-jersey-service.sh
```

Stop the current Jersey foundation:

```bash
cd backend
./stop-jersey-service.sh
```

To keep local startup settings persistent without shell-specific `export` commands,
put them in `backend/.env.local`. The run script reads that file automatically.

Example `backend/.env.local`:

```bash
JAVA_HOME=/usr/lib/jvm/java-21-openjdk
HR_APP_PORT=18082
```

Safer explicit form used in this repo:

```bash
cd backend
JAVA_HOME=/usr/lib/jvm/java-21-openjdk PATH=/usr/lib/jvm/java-21-openjdk/bin:$PATH ./build-jersey-service.sh
```

For DB-backed Jersey endpoints, put the active PostgreSQL connection values in
`backend/.env.local` or in your shell environment before starting the service:

```bash
AIHR_DB_HOSTNAME=localhost
AIHR_DB_PORT=5432
AIHR_DB_NAME=hrdb
AIHR_DB_USER=hrapp
AIHR_DB_PASSWORD=hrapp
HR_APP_PORT=18082
./run-jersey-service.sh
```

Override the Maven executable or local cache location if needed:

```bash
MVN_BIN=/path/to/mvn MAVEN_REPO_LOCAL=/path/to/maven-repo ./build-jersey-service.sh
```

## Maintainer flow

To pre-populate a local Maven cache:

```bash
cd backend
./cache-maven-repo.sh
```

Defaults:

- `JAVA_HOME` falls back to the detected `java` on `PATH`
- `MVN_BIN` falls back to the detected `mvn` on `PATH`
- `MAVEN_REPO_LOCAL` defaults to `~/.m2/repository`
- `MAVEN_SETTINGS_FILE` is optional and defaults to `~/.m2/settings.xml` only when that file exists
- `DB_CONNECT_TIMEOUT_MILLIS` defaults to `5000`
- `DB_READ_TIMEOUT_MILLIS` defaults to `30000`

`cache-maven-repo.sh` uses `MAVEN_SETTINGS_FILE` when supplied so maintainers can point Maven at an internal mirror if needed.

Because the shell default Java on this machine may still be Java 8, treat the `JAVA_HOME` fallback as unsafe for backend work in this repo. Prefer the explicit JDK 21 setting above.

## Example cache command

One way to pre-populate a local Maven cache is:

```bash
env JAVA_HOME=/path/to/jdk \
  PATH=/path/to/jdk/bin:$PATH \
  mvn -s /home/ssthakur/.m2/settings.xml \
  -Dmaven.repo.local=/path/to/maven-repo \
  -pl hrapp-service -am -DskipTests dependency:go-offline install
```
