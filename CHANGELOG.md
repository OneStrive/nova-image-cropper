# Release Notes

## [v5.0.0] - Security Update Fork

### Security
- **CRITICAL**: Removed `vue-template-compiler` package with XSS vulnerability (CVE-2024-9506)
- Updated build configuration to use `@vue/compiler-sfc` for Vue 3 compatibility
- All npm security audits now pass with 0 vulnerabilities

### Fixed
- Resolved duplicate declaration error in webpack.mix.js
- Fixed webpack alias configuration to correctly point to package resources
- Added missing `uid` package dependency required by Nova

### Changed
- This is a security-focused fork of ultrasimplified/nova5-image-cropper
- Build process now fully compatible with Vue 3
- Optimized webpack configuration for better module resolution

> Released 2026/01/05 - Security fork by OneStrive

---

## [v.2.3.1](https://github.com/ultrasimplified/nova5-image-cropper/compare/v2.3.0...v2.3.1)

### Added

— Enabled indexWidth attribute to override image display

## [v2.3.0](https://github.com/ultrasimplified/nova5-image-cropper/compare/2.2.3...v2.3.0)

### Added

- Reintroduced convert function - pass a filetype ('png', 'jpeg', 'webp') to convert the uploaded image to the desired format

> Released 2024/12/27

### 2.2.3 Added

- Minor updates to code for PHP 8.4 / Nova 5 compatibility
- Update intervention/image to v.3.1

> Released 2024/12/26

### Derived from the excellent work of Clément Tessier and Stef van Esch

## [v1.1.0](https://github.com/ctessier/nova-advanced-image-field/compare/v1.0.2...v1.1.0)

## [v2.1.1](https://github.com/ctessier/nova-advanced-image-field/releases/tag/v2.1.0)
