# Translation Audit EN/VI

Generated: 2026-06-04T08:59:00.523Z

## Conclusion

PASS: translation completeness has no blocking key/type/empty-value issues in the static audit.

Dynamic i18n usages are listed for manual review because static analysis cannot resolve their keys safely.

## Summary

- EN leaf keys: 890
- VI leaf keys: 890
- Static i18n usages found: 1214
- Dynamic i18n usages needing manual review: 69
- Inline fallbacks found: 119
- Hardcoded visible text must_i18n: 0
- Hardcoded visible text review: 0
- Unique used keys missing in EN: 0
- Unique used keys missing in VI: 0
- Keys unused by static scan: 0

## Missing Between Locale Files

### Missing in EN

- None

### Missing in VI

- None

## Type Mismatches

- None

## Empty or Placeholder Values

### EN

- None

### VI

- None

## Used But Missing

### Missing in EN

- None

### Missing in VI

- None

## Inline Fallbacks

- `tourism.leave_comment_placeholder` (t()) at `src/components/common/ReviewTextarea.jsx:27` fallback="Chia sẻ trải nghiệm, cảm nhận của bạn về địa điểm này..."
- `tourism.min_characters` (t()) at `src/components/common/ReviewTextarea.jsx:44` fallback="Tối thiểu 10 ký tự"
- `tourism.characters_left` (t()) at `src/components/common/ReviewTextarea.jsx:47` fallback="còn"
- `profile.username` (t()) at `src/features/auth/components/profile/ProfileSections.jsx:104` fallback="Username"
- `profile.fullName` (t()) at `src/features/auth/components/profile/ProfileSections.jsx:110` fallback="Full name"
- `profile.email` (t()) at `src/features/auth/components/profile/ProfileSections.jsx:114` fallback="Email"
- `profile.phone` (t()) at `src/features/auth/components/profile/ProfileSections.jsx:117` fallback="Phone number"
- `profile.address` (t()) at `src/features/auth/components/profile/ProfileSections.jsx:123` fallback="Address"
- `profile.cancel` (t()) at `src/features/auth/components/profile/ProfileSections.jsx:129` fallback="Cancel"
- `profile.saving` (t()) at `src/features/auth/components/profile/ProfileSections.jsx:133` fallback="Saving..."
- `profile.saveChanges` (t()) at `src/features/auth/components/profile/ProfileSections.jsx:134` fallback="Save changes"
- `profile.changePassword` (t()) at `src/features/auth/components/profile/ProfileSections.jsx:153` fallback="Change password"
- `profile.currentPassword` (t()) at `src/features/auth/components/profile/ProfileSections.jsx:156` fallback="Current password"
- `profile.newPassword` (t()) at `src/features/auth/components/profile/ProfileSections.jsx:164` fallback="New password"
- `profile.confirmNewPassword` (t()) at `src/features/auth/components/profile/ProfileSections.jsx:174` fallback="Confirm new password"
- `profile.cancelShort` (t()) at `src/features/auth/components/profile/ProfileSections.jsx:185` fallback="Cancel"
- `profile.confirmAction` (t()) at `src/features/auth/components/profile/ProfileSections.jsx:188` fallback="Confirm"
- `profile.username` (t()) at `src/features/auth/components/profile/ProfileSections.jsx:201` fallback="Username"
- `profile.phone` (t()) at `src/features/auth/components/profile/ProfileSections.jsx:207` fallback="Phone number"
- `profile.address` (t()) at `src/features/auth/components/profile/ProfileSections.jsx:213` fallback="Address"
- `profile.joinDate` (t()) at `src/features/auth/components/profile/ProfileSections.jsx:219` fallback="Join date"
- `profile.avatar.change` (t()) at `src/features/auth/components/profile/ProfileSections.jsx:34` fallback="Change photo"
- `profile.role.member` (t()) at `src/features/auth/components/profile/ProfileSections.jsx:44` fallback="Member"
- `profile.notUpdated` (t()) at `src/features/auth/components/profile/ProfileSections.jsx:52` fallback="Not updated"
- `profile.notUpdated` (t()) at `src/features/auth/components/profile/ProfileSections.jsx:56` fallback="Not updated"
- `profile.notUpdated` (t()) at `src/features/auth/components/profile/ProfileSections.jsx:60` fallback="Not updated"
- `profile.title` (t()) at `src/features/auth/components/profile/ProfileSections.jsx:76` fallback="My Profile"
- `profile.changePasswordSecure` (t()) at `src/features/auth/components/profile/ProfileSections.jsx:81` fallback="Change secure password"
- `profile.editProfile` (t()) at `src/features/auth/components/profile/ProfileSections.jsx:84` fallback="Edit profile"
- `profile.validation.invalidEmail` (t()) at `src/features/auth/hooks/useProfilePageModel.js:100` fallback="Invalid email format."
- `profile.validation.nameMin` (t()) at `src/features/auth/hooks/useProfilePageModel.js:105` fallback="Full name must be at least 2 characters."
- `profile.validation.invalidName` (t()) at `src/features/auth/hooks/useProfilePageModel.js:107` fallback="Invalid full name."
- `profile.validation.invalidPhone` (t()) at `src/features/auth/hooks/useProfilePageModel.js:111` fallback="Invalid phone number."
- `profile.toast.updateSuccess` (t()) at `src/features/auth/hooks/useProfilePageModel.js:138` fallback="Profile updated successfully!"
- `profile.toast.updateError` (t()) at `src/features/auth/hooks/useProfilePageModel.js:145` fallback="Failed to update profile."
- `profile.toast.updateSuccess` (t()) at `src/features/auth/hooks/useProfilePageModel.js:154` fallback="Profile updated successfully!"
- `profile.toast.updateError` (t()) at `src/features/auth/hooks/useProfilePageModel.js:161` fallback="Failed to update profile."
- `profile.validation.currentRequired` (t()) at `src/features/auth/hooks/useProfilePageModel.js:174` fallback="Current password is required."
- `profile.validation.newRequired` (t()) at `src/features/auth/hooks/useProfilePageModel.js:178` fallback="New password is required."
- `profile.validation.newMin` (t()) at `src/features/auth/hooks/useProfilePageModel.js:181` fallback="New password must be at least 8 characters."
- `profile.validation.newWeak` (t()) at `src/features/auth/hooks/useProfilePageModel.js:186` fallback="New password must include lowercase, uppercase, number, and special character."
- `profile.validation.confirmMismatch` (t()) at `src/features/auth/hooks/useProfilePageModel.js:194` fallback="Password confirmation does not match."
- `profile.toast.changePasswordError` (t()) at `src/features/auth/hooks/useProfilePageModel.js:215` fallback="Failed to change password."
- `profile.toast.changePasswordSuccess` (t()) at `src/features/auth/hooks/useProfilePageModel.js:222` fallback="Password changed successfully."
- `profile.toast.invalidImage` (t()) at `src/features/auth/hooks/useProfilePageModel.js:71` fallback="Invalid image file type."
- `profile.toast.imageTooLarge` (t()) at `src/features/auth/hooks/useProfilePageModel.js:75` fallback="Image size must be 5MB or less."
- `profile.validation.username` (t()) at `src/features/auth/hooks/useProfilePageModel.js:91` fallback="Username must contain only letters and numbers, 3-50 characters."
- `profile.validation.emailMax` (t()) at `src/features/auth/hooks/useProfilePageModel.js:98` fallback="Email must be at most 100 characters."
- `zoomed_image` (t()) at `src/features/map/components/ModalCarousel.jsx:134` fallback="Ảnh phóng to"
- `close` (t()) at `src/features/map/components/ModalCarousel.jsx:144` fallback="Đóng"
- `zoomed_image` (t()) at `src/features/map/components/ModalCarousel.jsx:148` fallback="Ảnh phóng to"
- `images_gallery` (t()) at `src/features/map/components/ModalCarousel.jsx:61` fallback="Thư viện ảnh"
- `explore_images` (t()) at `src/features/map/components/ModalCarousel.jsx:63` fallback="Khám phá những hình ảnh đẹp của địa điểm này"
- `image` (t()) at `src/features/map/components/ModalCarousel.jsx:76` fallback="Ảnh"
- `tourismPointPage.reviews` (t()) at `src/features/tourism-points/components/list/TourismPointCards.jsx:129` fallback="đánh giá"
- `tourismPointPage.free` (t()) at `src/features/tourism-points/components/list/TourismPointCards.jsx:164` fallback="Miễn phí"
- `tourismPointPage.view_detail` (t()) at `src/features/tourism-points/components/list/TourismPointCards.jsx:172` fallback="Xem chi tiết"
- `tourismPointPage.free` (t()) at `src/features/tourism-points/components/list/TourismPointCards.jsx:238` fallback="Miễn phí"
- `tourismPointPage.free` (t()) at `src/features/tourism-points/components/list/TourismPointCards.jsx:304` fallback="Miễn phí"
- `tourismPointPage.unknown_category` (t()) at `src/features/tourism-points/pages/TourismPointPageContent copy.jsx:171` fallback="Unknown category"
- `tourismPointPage.unknown_category` (t()) at `src/features/tourism-points/pages/TourismPointPageContent.jsx:173` fallback="Unknown category"
- `tourPage.gallery` (t()) at `src/features/tours/components/TourDetailGallerySection.jsx:11` fallback="Thư viện ảnh"
- `tourPage.viewAllPhotos` (t()) at `src/features/tours/components/TourDetailGallerySection.jsx:19` fallback="Xem tất cả"
- `tourPage.unknown` (t()) at `src/features/tours/components/TourDetailHero.jsx:11` fallback="Tour"
- `tourPage.locationPending` (t()) at `src/features/tours/components/TourDetailHero.jsx:38` fallback="Đang cập nhật vị trí"
- `tourPage.noDescription` (t()) at `src/features/tours/components/TourDetailIntroSection.jsx:10` fallback="Chưa có mô tả."
- `tourPage.includes` (t()) at `src/features/tours/components/TourDetailIntroSection.jsx:18` fallback="Bao gồm"
- `tourPage.excludes` (t()) at `src/features/tours/components/TourDetailIntroSection.jsx:33` fallback="Không bao gồm"
- `tourPage.detailDescriptionTitle` (t()) at `src/features/tours/components/TourDetailIntroSection.jsx:7` fallback="Giới thiệu"
- `tourPage.reviews` (t()) at `src/features/tours/components/TourDetailReviewsSection.jsx:113` fallback="Đánh giá"
- `tourPage.review` (t()) at `src/features/tours/components/TourDetailReviewsSection.jsx:119` fallback="Đánh giá"
- `tourPage.reviewNotFound` (t()) at `src/features/tours/components/TourDetailReviewsSection.jsx:124` fallback="Không tìm thấy đánh giá"
- `tourPage.reviewsCount` (t()) at `src/features/tours/components/TourDetailReviewsSection.jsx:142` fallback="đánh giá"
- `tourPage.noReviews` (t()) at `src/features/tours/components/TourDetailReviewsSection.jsx:180` fallback="Chưa có đánh giá nào."
- `tourPage.page` (t()) at `src/features/tours/components/TourDetailReviewsSection.jsx:189` fallback="Trang"
- `common.prev` (t()) at `src/features/tours/components/TourDetailReviewsSection.jsx:199` fallback="Trước"
- `common.next` (t()) at `src/features/tours/components/TourDetailReviewsSection.jsx:207` fallback="Sau"
- `tourPage.leaveReview` (t()) at `src/features/tours/components/TourDetailReviewsSection.jsx:217` fallback="Viết đánh giá của bạn"
- `tourPage.rateCriteria` (t()) at `src/features/tours/components/TourDetailReviewsSection.jsx:223` fallback="Đánh giá theo tiêu chí"
- `tourPage.avgScore` (t()) at `src/features/tours/components/TourDetailReviewsSection.jsx:258` fallback="Điểm trung bình"
- `tourPage.guest` (t()) at `src/features/tours/components/TourDetailReviewsSection.jsx:27` fallback="Khách"
- `tourPage.comment` (t()) at `src/features/tours/components/TourDetailReviewsSection.jsx:271` fallback="Nội dung đánh giá"
- `tourPage.leave_comment_placeholder` (t()) at `src/features/tours/components/TourDetailReviewsSection.jsx:278` fallback="Chia sẻ trải nghiệm, cảm nhận của bạn về tour này..."
- `tourPage.cancel` (t()) at `src/features/tours/components/TourDetailReviewsSection.jsx:293` fallback="Huỷ"
- `tourPage.sending` (t()) at `src/features/tours/components/TourDetailReviewsSection.jsx:303` fallback="Đang gửi..."
- `tourPage.sendReview` (t()) at `src/features/tours/components/TourDetailReviewsSection.jsx:304` fallback="Gửi đánh giá"
- `tourPage.cleanliness` (t()) at `src/features/tours/components/TourDetailReviewsSection.jsx:31` fallback="Sạch sẽ"
- `tourPage.service` (t()) at `src/features/tours/components/TourDetailReviewsSection.jsx:32` fallback="Dịch vụ"
- `tourPage.value` (t()) at `src/features/tours/components/TourDetailReviewsSection.jsx:33` fallback="Giá trị"
- `tourPage.accessibility` (t()) at `src/features/tours/components/TourDetailReviewsSection.jsx:34` fallback="Tiếp cận"
- `tourPage.tourList` (t()) at `src/features/tours/components/TourDetailSidebar.jsx:28` fallback="Open map"
- `tourPage.contact` (t()) at `src/features/tours/components/TourDetailSidebar.jsx:36` fallback="Contact tour"
- `tourPage.unknown` (t()) at `src/features/tours/components/TourDetailStopsSection.jsx:122` fallback="Điểm dừng"
- `tourPage.itinerary` (t()) at `src/features/tours/components/TourDetailStopsSection.jsx:88` fallback="Lịch trình"
- `tourPage.day` (t()) at `src/features/tours/components/TourDetailStopsSection.jsx:97` fallback="Ngày"
- `tourPage.back` (t()) at `src/features/tours/components/TourDetailTopBar.jsx:11` fallback="Quay lại"
- `tourPage.actions.save` (t()) at `src/features/tours/components/TourDetailTopBar.jsx:23` fallback="Lưu"
- `tourPage.actions.share` (t()) at `src/features/tours/components/TourDetailTopBar.jsx:27` fallback="Chia sẻ"
- `tourPage.copied` (t()) at `src/features/tours/components/TourDetailTopBar.jsx:35` fallback="Đã sao chép liên kết"
- `tourPage.shared` (t()) at `src/features/tours/components/TourDetailTopBar.jsx:36` fallback="Đã chia sẻ"
- `tourPage.featured` (t()) at `src/features/tours/hooks/useTourDetailPageModel.jsx:444` fallback="Nổi bật"
- `tourPage.days` (t()) at `src/features/tours/hooks/useTourDetailPageModel.jsx:445` fallback="ngày"
- `tourPage.price` (t()) at `src/features/tours/hooks/useTourDetailPageModel.jsx:454` fallback="Giá từ"
- `tourPage.duration` (t()) at `src/features/tours/hooks/useTourDetailPageModel.jsx:468` fallback="Thời lượng"
- `tourPage.maxGuests` (t()) at `src/features/tours/hooks/useTourDetailPageModel.jsx:478` fallback="Sức chứa"
- `tourPage.people` (t()) at `src/features/tours/hooks/useTourDetailPageModel.jsx:482` fallback="người"
- `tourPage.rating` (t()) at `src/features/tours/hooks/useTourDetailPageModel.jsx:488` fallback="Đánh giá"
- `tourPage.startLocation` (t()) at `src/features/tours/hooks/useTourDetailPageModel.jsx:503` fallback="Địa điểm đi"
- `tourPage.unknown` (t()) at `src/features/tours/hooks/useTourDetailPageModel.jsx:504` fallback="Chưa cập nhật"
- `tourPage.endLocation` (t()) at `src/features/tours/hooks/useTourDetailPageModel.jsx:510` fallback="Địa điểm đến"
- `tourPage.unknown` (t()) at `src/features/tours/hooks/useTourDetailPageModel.jsx:511` fallback="Chưa cập nhật"
- `tourPage.duration` (t()) at `src/features/tours/hooks/useTourDetailPageModel.jsx:517` fallback="Thời lượng"
- `tourPage.provider` (t()) at `src/features/tours/hooks/useTourDetailPageModel.jsx:524` fallback="Nhà cung cấp"
- `tourPage.unknown` (t()) at `src/features/tours/hooks/useTourDetailPageModel.jsx:525` fallback="Chưa cập nhật"
- `tourPage.viewStopGallery` (t()) at `src/features/tours/pages/TourDetailPage.jsx:100` fallback="Xem thư viện ảnh điểm dừng"
- `tourPage.viewStopGallery` (t()) at `src/features/tours/pages/TourDetailPage.jsx:109` fallback="Xem thư viện ảnh điểm dừng"
- `tourPage.viewStopGallery` (t()) at `src/features/tours/pages/TourDetailPage.jsx:99` fallback="Xem thư viện ảnh điểm dừng"
- `tourPage.days` (t()) at `src/features/tours/utils/tourDetail.utils.js:11` fallback="ngày"
- `tourPage.unknown` (t()) at `src/features/tours/utils/tourDetail.utils.js:13` fallback="Unknown"

## Hardcoded Visible Text

### must_i18n by file

- None

### must_i18n

- None

### review

- None

## Suggested Missing-Key Additions

These are flat key additions for review. Values are intentionally set to `TODO_REVIEW` so the audit does not invent translation copy.

### EN Candidates

- None

```json
{}
```

### VI Candidates

- None

```json
{}
```

## Dynamic Usages for Manual Review

- t() at `src/components/common/WeatherAlertBell.jsx:324`
- t() at `src/features/feedback/components/FeedbackCard.jsx:27`
- t() at `src/features/feedback/components/FeedbackCard.jsx:28`
- t() at `src/features/feedback/components/FeedbackDetailDialog.jsx:100`
- t() at `src/features/feedback/components/FeedbackDetailDialog.jsx:109`
- t() at `src/features/feedback/components/FeedbackSubmitDialog.jsx:232`
- t() at `src/features/feedback/pages/FeedbackPageContent.jsx:138`
- t() at `src/features/festival/pages/FestivalDetailPageContent.jsx:49`
- t() at `src/features/festival/pages/FestivalPageContent.jsx:86`
- t() at `src/features/festival/pages/FestivalPageContent.jsx:381`
- t() at `src/features/festival/pages/FestivalPageContent.jsx:490`
- t() at `src/features/home/pages/HomePageContent.jsx:299`
- t() at `src/features/home/pages/HomePageContent.jsx:306`
- t() at `src/features/home/pages/HomePageContent.jsx:307`
- t() at `src/features/home/pages/HomePageContent.jsx:312`
- t() at `src/features/home/pages/HomePageContent.jsx:319`
- t() at `src/features/home/pages/HomePageContent.jsx:320`
- t() at `src/features/home/pages/HomePageContent.jsx:321`
- t() at `src/features/home/pages/HomePageContent.jsx:322`
- t() at `src/features/home/pages/HomePageContent.jsx:330`
- t() at `src/features/home/pages/HomePageContent.jsx:331`
- t() at `src/features/home/pages/HomePageContent.jsx:367`
- t() at `src/features/home/pages/HomePageContent.jsx:368`
- t() at `src/features/home/pages/HomePageContent.jsx:877`
- t() at `src/features/home/pages/HomePageContent.jsx:929`
- t() at `src/features/home/pages/HomePageContent.jsx:1054`
- t() at `src/features/home/pages/HomePageContent.jsx:1057`
- t() at `src/features/home/pages/HomePageContent.jsx:1302`
- t() at `src/features/home/pages/HomePageContent.jsx:1309`
- t() at `src/features/map/components/control/ToolBaseMap.jsx:111`
- t() at `src/features/map/components/control/ToolBaseMap.jsx:114`
- t() at `src/features/map/components/control/ToolBaseMap.jsx:114`
- t() at `src/features/map/components/control/ToolBaseMap.jsx:145`
- t() at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:72`
- t() at `src/features/map/components/leftSidebar/DataLayerMapStylePanel.jsx:73`
- t() at `src/features/map/components/mapPanel/MapCategoryOverlay.jsx:23`
- t() at `src/features/map/components/MapWeatherCard.jsx:97`
- t() at `src/features/map/components/rightSidebar/EventPanel.jsx:61`
- t() at `src/features/map/components/rightSidebar/MapRightSidebar.jsx:88`
- t() at `src/features/map/components/rightSidebar/MapRightSidebar.jsx:112`
- t() at `src/features/map/components/rightSidebar/TourPanel.jsx:225`
- t() at `src/features/map/components/rightSidebar/TrafficPanel.jsx:247`
- t() at `src/features/map/pages/MapPageContent.jsx:147`
- t() at `src/features/map/pages/MapPageContent.jsx:155`
- t() at `src/features/map/utils/capacityStatus.js:80`
- t() at `src/features/ocop/pages/OcopDetailPageContent.jsx:65`
- t() at `src/features/ocop/pages/OcopPageContent.jsx:72`
- t() at `src/features/ocop/pages/OcopPageContent.jsx:330`
- t() at `src/features/satellite/components/SatelliteCompareModePanel.jsx:311`
- t() at `src/features/satellite/components/SatelliteCompareModePanel.jsx:312`
- t() at `src/features/satellite/components/SatelliteLayerControl.jsx:92`
- t() at `src/features/satellite/components/SatelliteLayerControl.jsx:98`
- t() at `src/features/satellite/components/SatelliteSingleModePanel.jsx:273`
- t() at `src/features/satellite/components/SatelliteSingleModePanel.jsx:274`
- t() at `src/features/satellite/components/SatelliteStatsPanel.jsx:42`
- t() at `src/features/satellite/components/SatelliteStatsPanel.jsx:59`
- t() at `src/features/tourism-points/pages/TourismPointPageContent copy.jsx:322`
- t() at `src/features/tourism-points/pages/TourismPointPageContent.jsx:329`
- t() at `src/features/vlog/pages/VlogPageContent.jsx:38`
- t() at `src/features/vlog/pages/VlogPageContent.jsx:39`
- t() at `src/features/vlog/pages/VlogPageContent.jsx:40`
- t() at `src/features/vlog/pages/VlogPageContent.jsx:41`
- t() at `src/features/vlog/pages/VlogPageContent.jsx:42`
- t() at `src/features/vlog/pages/VlogPageContent.jsx:43`
- t() at `src/features/vlog/pages/VlogPageContent.jsx:51`
- t() at `src/features/vlog/pages/VlogPageContent.jsx:52`
- t() at `src/pages/Errors/ErrorPage.jsx:41`
- t() at `src/pages/Errors/ErrorPage.jsx:46`
- t() at `src/pages/Errors/ErrorPage.jsx:57`

## Unused Keys by Static Scan

- None
