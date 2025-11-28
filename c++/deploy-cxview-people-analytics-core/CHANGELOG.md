# Changelog

## [4.1.5] - 2023-24-03
**GatewayVersion == 3.5.0**

### Added
- Add field "person_id" to payload: entry, stall

### Changed
- Update model detection (yolox base)
- Remove the average time calculation mechanism at box
- Remove mechanism "is_line_intersection"
- Refactor function "process_line"
- Refactor utils lib

### Fixed
## [4.1.4] - 2023-03-09
**GatewayVersion == 3.5.0**

### Added

### Changed

### Fixed
- Fixed: stdev is nan

## [4.1.3] - 2023-03-03
**GatewayVersion == 3.5.0**

### Added
- Add new field "person_id" into entry payload
- New entry counting type for window outside (Pharmacity optional)

### Changed
- Refactor Zone Analytics feature

### Fixed

## [4.1.2] - 2022-12-01
**GatewayVersion == 3.3.0**

### Added
- Add RSS logging

### Changed
- Update bytetrack
- Update detection model nano_20221130

### Fixed


## [4.1.1] - 2022-11-17
**GatewayVersion == 3.3.0**

### Added

### Changed

### Fixed
- issue #4: bug entry nvidia

## [4.1.0] - 2022-11-07
**GatewayVersion == 3.3.0**

### Added
- Add env variable: USER_ID
- Separate faiss database mechanism for each user

### Changed

### Fixed
- Fix memleak

## [4.0.7] - 2022-10-02
**GatewayVersion == 3.3.0**

### Added

### Changed
- Update detection model nano_20221102

### Fixed


## [4.0.6] - 2022-10-28
**GatewayVersion == 3.3.0**

### Added

### Changed

### Fixed
- Fixed average time dump config error leads to wrong counting data

## [4.0.5] - 2022-10-20
**GatewayVersion == 3.3.0**

### Added

### Changed
- Update reid baseline model using fast-reid osnet 512 output shape

### Fixed
- Fixed issue #3: Algorithm to remove staff around the configuration area

## [4.0.4] - 2022-09-20
**GatewayVersion == 3.2.1**

### Added

### Changed
- Upgrade image base v0.2.3
- Update Dockerfile

### Fixed
- Data difference between 2d heatmap and layout

## [4.0.3] - 2022-08-26
**GatewayVersion == 3.2.1**

### Added

### Changed
- Upgrade image base

### Fixed
- fixed switch to fakesrc freeze

## [4.0.2] - 2022-08-05
**GatewayVersion == 3.2.0**

### Added
- Add **gst-plugins-good** for selection stream index

### Changed
- Remove *nvmultistreamtiler* in pipeline
- Upgrade image base

### Fixed
- nvmsgbroker lost message

## [4.0.1] - 2022-07-29
**GatewayVersion == 3.1.2**

### Added

### Changed

### Fixed
- Duplicate heatmap

## [4.0.0] - 2022-06-15
**GatewayVersion == 3.1.2**

### Added
- Add new env variable:
  - **PIPELINE_CONFIG** (for base plugin)
  - **HEALTHCHECK_TOPIC** (for base plugin)

### Changed
- Change env variable **SERVER** to **BOOTSTRAP_SERVER** (for all plugin)
- Change env variable **TOPIC** to **COUNTING_TOPIC** (for counting plugin)

### Fixed
