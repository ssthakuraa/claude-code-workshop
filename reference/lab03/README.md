# Lab 03 Escape Hatch

Restore the completed Country and Location backend slices.

This rescue path is cumulative with Lab 01. The `HrApplicationConfig.java` copy in
this folder keeps Region registration in place, so use it after the Lab 01
Region slice is already present. If you skipped Lab 01, restore `reference/lab01/`
first:

```text
Restore the completed Country and Location slices from `reference/lab03/`.

Copy back only these files:
- `reference/lab03/backend/hrapp-service/src/main/java/com/company/hr/dto/request/HrCountryRequest.java` -> `backend/hrapp-service/src/main/java/com/company/hr/dto/request/HrCountryRequest.java`
- `reference/lab03/backend/hrapp-service/src/main/java/com/company/hr/dto/request/HrLocationRequest.java` -> `backend/hrapp-service/src/main/java/com/company/hr/dto/request/HrLocationRequest.java`
- `reference/lab03/backend/hrapp-service/src/main/java/com/company/hr/dto/response/HrCountryDTO.java` -> `backend/hrapp-service/src/main/java/com/company/hr/dto/response/HrCountryDTO.java`
- `reference/lab03/backend/hrapp-service/src/main/java/com/company/hr/dto/response/HrLocationDTO.java` -> `backend/hrapp-service/src/main/java/com/company/hr/dto/response/HrLocationDTO.java`
- `reference/lab03/backend/hrapp-service/src/main/java/com/company/hr/repository/HrCountryJdbcRepository.java` -> `backend/hrapp-service/src/main/java/com/company/hr/repository/HrCountryJdbcRepository.java`
- `reference/lab03/backend/hrapp-service/src/main/java/com/company/hr/repository/HrLocationJdbcRepository.java` -> `backend/hrapp-service/src/main/java/com/company/hr/repository/HrLocationJdbcRepository.java`
- `reference/lab03/backend/hrapp-service/src/main/java/com/company/hr/resource/HrCountryResource.java` -> `backend/hrapp-service/src/main/java/com/company/hr/resource/HrCountryResource.java`
- `reference/lab03/backend/hrapp-service/src/main/java/com/company/hr/resource/HrLocationResource.java` -> `backend/hrapp-service/src/main/java/com/company/hr/resource/HrLocationResource.java`
- `reference/lab03/backend/hrapp-service/src/main/java/com/company/hr/HrApplicationConfig.java` -> `backend/hrapp-service/src/main/java/com/company/hr/HrApplicationConfig.java`

Do not inspect or modify anything else.
Then tell me the restore is complete.
```
