
## Latest update: [0.2.3] 19-09-2022

### Fixed

- Assert(FALSE) when all src is disconnected or main pipeline is hanged - updated

### Added

### Change

- refactor dockerfile

## Latest update: [0.2.2] 25-08-2022

### Fixed

- Assert(FALSE) when all src is disconnected or main pipeline is hanged

### Added

### Change

- Update monitor plugin requirement: "srcmonitor" -> "srcmonitor name=monitor"
- Use monitor plugin property instead shm

## [0.2.1] 05-08-2022

### Fixed

### Added
- SrcMonitor: Update fps function

### Change

- if cannot send eos to src pipeline, remove it

## [0.2.0] 30-06-2022

### Fixed
- memleak gstd
- stutter video on WebRTC (via udp)
### Added
- Update srcmonitor plugin, **Main pipeline must contain a srcmonitor plugin**

### Change

## [0.1.0] 04-05-2022

### Fixed
### Added

### Change