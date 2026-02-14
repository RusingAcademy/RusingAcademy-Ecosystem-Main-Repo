# Route Map\n\nThis document maps all client-side and server-side routes from all 6 repositories.\n
\n## Repo: rusingacademy-ecosystem\n
### Client Routes

| Path | Component | Notes |
|---|---|---|
| /sign-in | SignIn |  |
| /sign-up | SignUp |  |
| /signup | Signup |  |
| /login | Login |  |
| /set-password | SetPassword |  |
| /forgot-password | ForgotPassword |  |
| /reset-password | ResetPassword |  |
| /verify-email | VerifyEmail |  |
| / | Hub |  |
| /ecosystem | Hub |  |
| /ecosystem-old | EcosystemLanding |  |
| /lingueefy | Home |  |
| /lingueefy/success | CoachingPlanSuccess |  |
| /home | HomeRedirect |  |
| /coaches | Coaches |  |
| /coaches/:slug | CoachProfile |  |
| /coach-invite/:token | CoachInviteClaim |  |
| /invite/:token | AcceptInvitation |  |
| /messages | Messages |  |
| /session/:sessionId | VideoSession |  |
| /become-a-coach | BecomeCoach |  |
| /how-it-works | HowItWorks |  |
| /curriculum | CurriculumPathSeries |  |
| /curriculum-old | Curriculum |  |
| /courses | CoursesPage |  |
| /courses-old | Courses |  |
| /courses/success | CourseSuccess |  |
| /courses/:slug | CourseDetail |  |
| /courses/:slug/lessons/:lessonId | LessonViewer |  |
| /learn/:slug | LearnPortal |  |
| /learn/:slug/lessons/:lessonId | LearnLessonPage |  |
| /paths | Paths |  |
| /paths/:slug | PathDetail |  |
| /paths/:slug/success | PathEnrollmentSuccess |  |
| /pricing | Pricing |  |
| /about | About |  |
| /contact | Contact |  |
| /unsubscribe/:token | Unsubscribe |  |
| /terms | Terms |  |
| /privacy | Privacy |  |
| /privacy-policy | PrivacyPolicy |  |
| /cookies | Cookies |  |
| /accessibility | Accessibility |  |
| /faq | FAQ |  |
| /blog | Blog |  |
| /careers | Careers |  |
| /for-departments | ForDepartments |  |
| /for-business | ForBusiness |  |
| /organizations | Organizations |  |
| /community | Community |  |
| /sle-diagnostic | SLEDiagnostic |  |
| /prof-steven-ai | AICoach |  |
| /ai-coach | AICoach |  |
| /sle-ai-companion | AICoach |  |
| /booking | BookingForm |  |
| /booking/confirmation | BookingConfirmation |  |
| /booking/success | BookingSuccess |  |
| /booking/cancelled | BookingCancelled |  |
| /dashboard | DashboardRouter |  |
| /app | AppDashboard | Render Prop |
| /app/overview | AppDashboard | Render Prop |
| /app/my-courses | AppDashboard | Render Prop |
| /app/my-progress | AppDashboard | Render Prop |
| /app/my-sessions | AppDashboard | Render Prop |
| /app/my-payments | AppDashboard | Render Prop |
| /app/favorites | AppDashboard | Render Prop |
| /app/certificates | AppDashboard | Render Prop |
| /app/settings | AppDashboard | Render Prop |
| /app/notifications | AppDashboard | Render Prop |
| /app/ai-practice | AppDashboard | Render Prop |
| /app/conversation | AppDashboard | Render Prop |
| /app/practice-history | AppDashboard | Render Prop |
| /app/simulation | AppDashboard | Render Prop |
| /app/sle-exam | AppDashboard | Render Prop |
| /app/sle-progress | AppDashboard | Render Prop |
| /app/badges | AppDashboard | Render Prop |
| /app/loyalty | AppDashboard | Render Prop |
| /app/my-students | AppDashboard | Render Prop |
| /app/availability | AppDashboard | Render Prop |
| /app/coach-profile | AppDashboard | Render Prop |
| /app/earnings | AppDashboard | Render Prop |
| /app/video-sessions | AppDashboard | Render Prop |
| /app/coach-guide | AppDashboard | Render Prop |
| /app/team | AppDashboard | Render Prop |
| /app/cohorts | AppDashboard | Render Prop |
| /app/budget | AppDashboard | Render Prop |
| /app/compliance | AppDashboard | Render Prop |
| /dashboard/learner | LearnerDashboard |  |
| /learner | LearnerDashboard |  |
| /learner/courses | LearnerCourses |  |
| /learner/book-session | BookSession |  |
| /my-learning | MyLearning |  |
| /certificates/:certificateNumber | CertificateViewer |  |
| /verify | VerifyCertificate |  |
| /verify/:certificateNumber | VerifyCertificate |  |
| /my-sessions | MySessions |  |
| /settings | LearnerSettings |  |
| /progress | LearnerProgress |  |
| /progress/report | ProgressReport |  |
| /payments | LearnerPayments |  |
| /favorites | LearnerFavorites |  |
| /rewards | LearnerLoyalty |  |
| /badges | BadgesCatalog |  |
| /leaderboard | Leaderboard |  |
| /profile/:userId | UserProfile |  |
| /referrals | LearnerReferrals |  |
| /affiliate | AffiliateDashboard |  |
| /bundles | BundlesAndPaths |  |
| /conversation-practice | ConversationPractice |  |
| /practice | Practice |  |
| /sle-practice | SLEPractice |  |
| /sle-exam-simulation | SLEExamSimulation |  |
| /sle-progress | SLEProgressDashboard |  |
| /dictation-practice | DictationPractice |  |
| /practice-history | PracticeHistory |  |
| /practice-history/:sessionId | PracticeHistory |  |
| /downloads | MyDownloads |  |
| /dashboard/coach | CoachDashboard |  |
| /coach | CoachDashboard |  |
| /coach/dashboard | CoachDashboard |  |
| /coach/earnings | CoachEarnings |  |
| /coach/earnings/history | CoachEarningsHistory |  |
| /coach/payments | CoachPayments |  |
| /coach/guide | CoachGuide |  |
| /coach/terms | CoachTerms |  |
| /coach/:slug | CoachProfile |  |
| /dashboard/hr | HRDashboard |  |
| /dashboard/hr/overview | HRDashboard |  |
| /hr | HRDashboard |  |
| /hr/dashboard | HRDashboard |  |
| /admin | AdminControlCenter | Render Prop |
| /admin/overview | AdminControlCenter | Render Prop |
| /admin/users | AdminControlCenter | Render Prop |
| /admin/coaches | AdminControlCenter | Render Prop |
| /admin/coaching | AdminControlCenter | Render Prop |
| /admin/courses | AdminControlCenter | Render Prop |
| /admin/pricing | AdminControlCenter | Render Prop |
| /admin/coupons | AdminControlCenter | Render Prop |
| /admin/crm | AdminControlCenter | Render Prop |
| /admin/email | AdminControlCenter | Render Prop |
| /admin/analytics | AdminControlCenter | Render Prop |
| /admin/activity | AdminControlCenter | Render Prop |
| /admin/preview | AdminControlCenter | Render Prop |
| /admin/settings | AdminControlCenter | Render Prop |
| /admin/funnels | AdminControlCenter | Render Prop |
| /admin/automations | AdminControlCenter | Render Prop |
| /admin/pages | AdminControlCenter | Render Prop |
| /admin/ai-companion | AdminControlCenter | Render Prop |
| /admin/sales-analytics | AdminControlCenter | Render Prop |
| /admin/media-library | AdminControlCenter | Render Prop |
| /admin/permissions | AdminControlCenter | Render Prop |
| /admin/email-templates | AdminControlCenter | Render Prop |
| /admin/notifications | AdminControlCenter | Render Prop |
| /admin/import-export | AdminControlCenter | Render Prop |
| /admin/preview-mode | AdminControlCenter | Render Prop |
| /admin/ai-predictive | AdminControlCenter | Render Prop |
| /admin/stripe-testing | AdminControlCenter | Render Prop |
| /admin/live-kpi | AdminControlCenter | Render Prop |
| /admin/onboarding | AdminControlCenter | Render Prop |
| /admin/enterprise | AdminControlCenter | Render Prop |
| /admin/sle-exam | AdminControlCenter | Render Prop |
| /admin/content-intelligence | AdminControlCenter | Render Prop |
| /admin/drip-content | AdminControlCenter | Render Prop |
| /admin/ab-testing | AdminControlCenter | Render Prop |
| /admin/org-billing | AdminControlCenter | Render Prop |
| /admin/weekly-challenges | AdminControlCenter | Render Prop |
| /admin/enrollments | AdminControlCenter | Render Prop |
| /admin/reviews | AdminControlCenter | Render Prop |
| /admin/certificates | AdminControlCenter | Render Prop |
| /admin/gamification | AdminControlCenter | Render Prop |
| /dashboard/admin | AdminControlCenter | Render Prop |
| /admin/applications | AdminCoachApplications |  |
| /admin/dashboard | AdminControlCenter | Render Prop |
| /admin/commission | AdminCommission |  |
| /admin/reminders | AdminReminders |  |
| /admin/content | AdminContentManagement |  |
| /admin/leads | AdminLeads |  |
| /dashboard/admin/leads | AdminLeads |  |
| /rusingacademy | RusingAcademyLanding |  |
| /rusingacademy/old | RusingAcademyHome |  |
| /rusingacademy/programs | RusingAcademyPrograms |  |
| /rusingacademy/contact | RusingAcademyContact |  |
| /rusingacademy/for-business | RusingAcademyForBusiness |  |
| /rusingacademy/for-government | RusingAcademyForGovernment |  |
| /barholex-media | BarholexMediaLanding |  |
| /barholex | BarholexMediaLanding |  |
| /barholex/old | BarholexHome |  |
| /barholex/services | BarholexServices |  |
| /barholex/portfolio | BarholexPortfolio |  |
| /barholex/contact | BarholexContact |  |
| /ecosystem | EcosystemHub |  |
| /p/:slug | CMSPage |  |
| /404 | NotFound |  |

## Server Router Procedures

| Router | Procedure | Type (query/mutation) |
|---|---|---|
| coachRouter | myProfile | query |
| coachRouter | getAvailability | query |
| coachRouter | getEarningsSummary | query |
| coachRouter | getPayoutLedger | query |
| coachRouter | getCalendarSettings | query |
| coachRouter | getApplicationStatus | query |
| coachRouter | getApplicationTimeline | query |
| coachRouter | getMyProfile | query |
| coachRouter | getUpcomingSessions | query |
| coachRouter | getMyLearners | query |
| coachRouter | getEarningsSummaryV2 | query |
| coachRouter | getPendingRequests | query |
| coachRouter | getTodaysSessions | query |
| coachRouter | myProfile | query |
| coachRouter | upcomingSessions | query |
| coachRouter | latestSession | query |
| coachRouter | pastSessions | query |
| coachRouter | cancelledSessions | query |
| coachRouter | getProgressReport | query |
| coachRouter | getReportPreferences | query |
| coachRouter | sendProgressReport | mutation |
| coachRouter | favorites | query |
| coachRouter | getLoyaltyPoints | query |
| coachRouter | getAvailableRewards | query |
| coachRouter | getPointsHistory | query |
| coachRouter | getReferralStats | query |
| coachRouter | getReferralInvitations | query |
| coachRouter | getChallenges | query |
| coachRouter | getStreak | query |
| coachRouter | useStreakFreeze | mutation |
| coachRouter | updateStreak | mutation |
| coachRouter | getProfile | query |
| coachRouter | getUpcomingSessions | query |
| coachRouter | getMyCourses | query |
| coachRouter | getMyBadges | query |
| coachRouter | getVelocityData | query |
| coachRouter | getCertificationStatus | query |
| coachRouter | getMyXp | query |
| coachRouter | getMyCoachingPlans | query |
| coachRouter | history | query |
| coachRouter | tiers | query |
| coachRouter | myCommission | query |
| coachRouter | myReferralLink | query |
| coachRouter | createReferralLink | mutation |
| coachRouter | seedTiers | mutation |
| coachRouter | startOnboarding | mutation |
| coachRouter | accountStatus | query |
| coachRouter | dashboardLink | mutation |
| coachRouter | getCourses | query |
| coachRouter | getCoachingPlans | query |
| coachRouter | auth | nested router |
| coachRouter | me | query |
| coachRouter | logout | mutation |
| coachRouter | booking | nested router |
| coachRouter | getMySessions | query |
| coachRouter | coachInvitation | nested router |
| coachRouter | getCoachesWithStatus | query |
| coachRouter | listAll | query |
| coachRouter | notification | nested router |
| coachRouter | list | query |
| coachRouter | unreadCount | query |
| coachRouter | markAllAsRead | mutation |
| coachRouter | getInAppNotifications | query |
| coachRouter | markAllNotificationsRead | mutation |
| coachRouter | notifications | nested router |
| coachRouter | unsubscribePush | mutation |
| coachRouter | message | nested router |
| coachRouter | conversations | query |
| coachRouter | admin | nested router |
| coachRouter | getPendingCoaches | query |
| coachRouter | getAnalytics | query |
| coachRouter | getDepartmentInquiries | query |
| coachRouter | getCoupons | query |
| coachRouter | getOrgStats | query |
| coachRouter | getRecentActivity | query |
| coachRouter | getCohorts | query |
| coachRouter | getPendingApprovals | query |
| coachRouter | documents | nested router |
| coachRouter | getApplicationStats | query |
| coachRouter | crm | nested router |
| coachRouter | forum | nested router |
| coachRouter | categories | query |
| coachRouter | events | nested router |
| coachRouter | myRegistrations | query |
| coachRouter | newsletter | nested router |
| coachRouter | search | nested router |
| coachRouter | reminders | nested router |
| coachRouter | cron | nested router |
| coursesRouter | getFeatured | query |
| authRouter | me | query |
| subscriptionsRouter | getPlans | query |
| subscriptionsRouter | getPortalUrl | mutation |
| subscriptionsRouter | getMySubscriptions | query |
| subscriptionsRouter | getActiveSubscription | query |
| subscriptionsRouter | getInvoices | query |
| emailSettingsRouter | getStatus | query |
| emailSettingsRouter | testConnection | mutation |
| emailSettingsRouter | getConfigurationGuide | query |
| gamificationRouter | getMyStats | query |
| gamificationRouter | getMyBadges | query |
| gamificationRouter | updateStreak | mutation |
| gamificationRouter | useStreakFreeze | mutation |
| gamificationRouter | getLeaderboardPrivacy | query |
| gamificationRouter | getCurrentChallenges | query |
| gamificationRouter | getStreakDetails | query |
| gamificationRouter | purchaseStreakFreeze | mutation |
| hrRouter | getMyOrganization | query |
| pathsRouter | myEnrollments | query |
| activitiesRouter | getSlotTemplate | query |
| stripeTestingRouter | getChecklist | query |
| stripeTestingRouter | getHistory | query |
| stripeTestingRouter | getStats | query |
| stripeTestingRouter | getStats | query |
| stripeTestingRouter | getPricingTiers | query |
| stripeTestingRouter | list | query |
| stripeTestingRouter | getStats | query |
| stripeTestingRouter | getDashboard | query |
| stripeTestingRouter | getReferrals | query |
| audioRouter | getVoices | query |
| audioRouter | getCoachVoices | query |
| audioRouter | getAllPronunciationAudio | query |
| sleCompanionRouter | getCoaches | query |
| sleServicesRouter | datasetStats | query |
| sleServicesRouter | writtenStats | query |
| sleProgressRouter | getSummary | query |
| learnerProgressionRouter | getMultiplier | query |
| learnerProgressionRouter | getMilestoneProgress | query |
| learnerProgressionRouter | getAllMilestones | query |
| learnerProgressionRouter | getRecommendations | query |
| learnerProgressionRouter | getProgressionSummary | query |
| coachLearnerMetricsRouter | getLearnersWithMetrics | query |
| coachLearnerMetricsRouter | getAtRiskLearners | query |
| coachLearnerMetricsRouter | getCohortSummary | query |
| badgeShowcaseRouter | getMyBadgeProgress | query |
| badgeShowcaseRouter | markBadgesSeen | mutation |
| badgeShowcaseRouter | getNewBadges | query |
| badgeShowcaseRouter | getAllDefinitions | query |

## Database Schema

| Table | Columns |
|---|---|
| users | id, openId, name, email, passwordHash, emailVerified, emailVerifiedAt, loginMethod, googleId, microsoftId, role, roleId, isOwner, avatarUrl, preferredLanguage, createdAt, updatedAt, lastSignedIn |
| coach_profiles | id, userId, slug, headline, headlineFr, bio, bioFr, videoUrl, photoUrl, city, province, languages, specializations, yearsExperience, credentials, hourlyRate, trialRate, totalSessions, totalStudents, averageRating, totalReviews, successRate, responseTimeHours, status, approvedAt, approvedBy, rejectionReason, stripeAccountId, stripeOnboarded, termsAcceptedAt, termsVersion, profileComplete, calendarType, calendlyUrl, calendlyEventTypeUri, createdAt, updatedAt |
| learner_profiles | id, userId, department, position, currentLevel, targetLevel, examDate, learningGoals, primaryFocus, targetLanguage, totalSessions, totalAiSessions, weeklyReportEnabled, weeklyReportDay, currentStreak, longestStreak, lastSessionWeek, streakFreezeUsed, certificationDate, certificationExpiry, certifiedLevel, weeklyStudyHours, lessonsCompleted, quizzesPassed, lastAssessmentScore, lastAssessmentDate, createdAt, updatedAt |
| coach_availability | id, coachId, dayOfWeek, startTime, endTime, timezone, isActive, createdAt, updatedAt |
| sessions | id, coachId, learnerId, packageId, scheduledAt, duration, timezone, sessionType, focusArea, learnerNotes, status, cancelledBy, cancellationReason, price, meetingUrl, coachNotes, completedAt, cancelledAt, stripePaymentId, calendlyEventId, createdAt, updatedAt |
| packages | id, learnerId, coachId, sessionsTotal, sessionsUsed, priceTotal, pricePerSession, status, expiresAt, stripePaymentIntentId, createdAt, updatedAt |
| reviews | id, sessionId, learnerId, coachId, rating, comment, sleAchievement, coachResponse, coachRespondedAt, isVisible, flaggedAt, flagReason, createdAt, updatedAt |
| conversations | id, participant1Id, participant2Id, lastMessageAt, lastMessagePreview, createdAt, updatedAt |
| messages | id, conversationId, senderId, recipientId, content, read, readAt, createdAt |
| ai_sessions | id, learnerId, sessionType, language, targetLevel, transcript, score, assessedLevel, feedback, duration, status, createdAt, completedAt |
| favorites | id, learnerId, coachId, createdAt |
| coach_applications | id, userId, coachProfileId, firstName, lastName, fullName, email, phone, city, country, timezone, residencyStatus, residencyStatusOther, education, certifications, yearsTeaching, sleExperience, credentials, certificateUrls, nativeLanguage, teachingLanguage, hasSleExperience, specializations, hourlyRate, trialRate, weeklyHours, headline, bio, teachingPhilosophy, photoUrl, introVideoUrl, whyLingueefy, termsAccepted, privacyAccepted, backgroundCheckConsent, codeOfConductAccepted, commissionAccepted, digitalSignature, status, reviewedBy, reviewedAt, reviewNotes, previousRejectionReason, resubmissionCount, lastResubmittedAt, isResubmission, parentApplicationId, createdAt, updatedAt |
| commission_tiers | id, name, tierType, commissionBps, minHours, maxHours, priority, isActive, createdAt, updatedAt |
| coach_commissions | id, coachId, tierId, overrideCommissionBps, overrideReason, isVerifiedSle, verifiedAt, verifiedBy, totalHoursTaught, createdAt, updatedAt |
| referral_links | id, coachId, code, discountCommissionBps, clickCount, signupCount, bookingCount, isActive, expiresAt, createdAt, updatedAt |
| referral_tracking | id, referralLinkId, learnerId, attributedAt, expiresAt, createdAt |
| payout_ledger | id, sessionId, packageId, coachId, learnerId, transactionType, grossAmount, platformFee, netAmount, commissionBps, commissionTierId, referralLinkId, isTrialSession, stripePaymentIntentId, stripeTransferId, stripeRefundId, status, processedAt, failureReason, notes, createdAt, updatedAt |
| coach_payouts | id, coachId, periodStart, periodEnd, grossEarnings, totalPlatformFees, netPayout, sessionCount, trialSessionCount, stripePayoutId, status, paidAt, failureReason, createdAt, updatedAt |
| platform_settings | id, key, value, description, updatedBy, createdAt, updatedAt |
| department_inquiries | id, name, email, phone, department, teamSize, message, preferredPackage, status, assignedTo, notes, followUpDate, createdAt, updatedAt |
| notifications | id, userId, type, title, message, link, metadata, read, readAt, createdAt |
| coach_documents | id, coachId, applicationId, documentType, title, description, fileUrl, fileName, fileSize, mimeType, issueDate, expiryDate, issuingAuthority, documentNumber, status, verifiedBy, verifiedAt, rejectionReason, createdAt, updatedAt |
| stripe_connect_accounts | id, coachId, stripeAccountId, accountType, onboardingComplete, chargesEnabled, payoutsEnabled, detailsSubmitted, businessType, country, defaultCurrency, payoutSchedule, payoutDay, requirementsCurrentlyDue, requirementsPastDue, requirementsEventuallyDue, lastWebhookAt, createdAt, updatedAt |
| coach_gallery_photos | id, coachId, photoUrl, thumbnailUrl, caption, altText, photoType, sortOrder, isActive, createdAt, updatedAt |
| push_subscriptions | id, userId, endpoint, p256dh, auth, userAgent, deviceName, enableBookings, enableMessages, enableReminders, enableMarketing, isActive, lastUsedAt, createdAt, updatedAt |
| session_notes | id, sessionId, coachId, notes, topicsCovered, areasForImprovement, homework, oralLevel, writtenLevel, readingLevel, sharedWithLearner, createdAt, updatedAt |
| coach_badges | id, coachId, badgeType, awardedAt, expiresAt, isActive, metadata, createdAt |
| learner_favorites | id, learnerId, coachId, note, createdAt |
| loyalty_points | id, learnerId, totalPoints, availablePoints, lifetimePoints, tier, createdAt, updatedAt |
| point_transactions | id, learnerId, type, points, description, referenceType, referenceId, createdAt |
| loyalty_rewards | id, name, nameEn, nameFr, description, descriptionEn, descriptionFr, pointsCost, rewardType, isActive, minTier, createdAt |
| redeemed_rewards | id, learnerId, rewardId, pointsSpent, status, discountCode, expiresAt, usedAt, createdAt |
| promo_coupons | id, code, name, description, descriptionFr, discountType, discountValue, maxUses, usedCount, maxUsesPerUser, minPurchaseAmount, validFrom, validUntil, applicableTo, newUsersOnly, isActive, createdBy, createdAt, updatedAt |
| coupon_redemptions | id, couponId, userId, sessionId, discountAmount, originalAmount, finalAmount, redeemedAt |
| referral_invitations | id, referrerId, referralCode, inviteeEmail, inviteMethod, status, inviteeId, convertedSessionId, referrerRewardPoints, referrerRewardPaid, inviteeRewardPoints, inviteeRewardPaid, clickedAt, registeredAt, convertedAt, expiresAt, createdAt |
| challenges | id, name, nameFr, description, descriptionFr, type, targetCount, pointsReward, period, isActive, createdAt |
| user_challenges | id, userId, challengeId, currentProgress, targetProgress, status, periodStart, periodEnd, completedAt, pointsAwarded, createdAt |
| in_app_notifications | id, userId, type, title, titleFr, message, messageFr, linkType, linkId, isRead, createdAt |
| organizations | id, name, slug, logo, domain, contactName, contactEmail, contactPhone, industry, employeeCount, description, adminUserId, status, createdAt, updatedAt |
| organization_coachs | id, organizationId, coachId, assignedAt, assignedBy, status, createdAt, updatedAt |
| coaching_credits | id, organizationId, totalCredits, usedCredits, availableCredits, creditValue, expiresAt, createdAt, updatedAt |
| credit_transactions | id, organizationId, type, amount, description, relatedSessionId, relatedLearner, processedBy, createdAt |
| organization_members | id, organizationId, userId, role, status, invitedAt, joinedAt, createdAt, updatedAt |
| application_comments | id, applicationId, userId, content, parentCommentId, isInternal, createdAt, updatedAt |
| application_reminders | id, applicationId, slaHours, submittedAt, dueAt, reminderSentAt, reminderCount, lastReminderAt, isOverdue, completedAt, createdAt, updatedAt |
| admin_performance_metrics | id, adminId, totalReviewed, totalApproved, totalRejected, averageReviewTimeHours, approvalRate, rejectionRate, periodStart, periodEnd, createdAt, updatedAt |
| comment_templates | id, createdBy, name, description, content, category, isPublic, isArchived, usageCount, lastUsedAt, createdAt, updatedAt |
| comment_mentions | id, commentId, mentionedUserId, notificationSent, notificationSentAt, createdAt |
| admin_badges | id, name, description, icon, color, criteria, threshold, thresholdUnit, isActive, tier, createdAt, updatedAt |
| admin_achievements | id, adminId, badgeId, achievedAt, value, notificationSent, createdAt |
| achievement_milestones | id, adminId, badgeId, currentValue, targetValue, progressPercentage, isCompleted, completedAt, createdAt, updatedAt |
| leaderboard_archives | id, season, seasonType, startDate, endDate, leaderboardSnapshot, createdAt, isActive |
| admin_teams | id, name, description, department, teamLeadId, createdAt, updatedAt |
| admin_team_members | id, teamId, adminId, role, joinedAt |
| team_performance_metrics | id, teamId, periodStart, periodEnd, totalApplicationsReviewed, totalApproved, totalRejected, averageReviewTimeHours, teamApprovalRate, teamRejectionRate, activeMembers, createdAt, updatedAt |
| custom_badge_criteria | id, badgeId, criteriaType, minValue, maxValue, targetValue, customFormula, isActive, createdBy, createdAt, updatedAt |
| badge_criteria_templates | id, name, description, templateType, criteriaConfig, isPublic, createdBy, createdAt, updatedAt |
| ecosystem_leads | id, firstName, lastName, email, phone, company, jobTitle, source, formType, leadType, status, message, interests, budget, timeline, preferredLanguage, assignedTo, leadScore, qualificationNotes, crossSellOpportunities, linkedUserId, emailOptOut, emailOptOutDate, emailOptOutReason, utmSource, utmMedium, utmCampaign, referrer, ipAddress, createdAt, updatedAt, lastContactedAt, convertedAt |
| ecosystem_lead_activities | id, leadId, activityType, description, previousValue, newValue, metadata, performedBy, createdAt |
| ecosystem_lead_notes | id, leadId, content, isPinned, authorId, createdAt, updatedAt |
| ecosystem_cross_sell_opportunities | id, leadId, sourcePlatform, targetPlatform, opportunityType, description, estimatedValue, status, identifiedAt, convertedAt |
| follow_up_sequences | id, name, description, triggerType, targetScoreMin, targetScoreMax, targetStatuses, isActive, createdAt, updatedAt |
| sequence_steps | id, sequenceId, stepOrder, delayDays, delayHours, emailSubjectEn, emailSubjectFr, emailBodyEn, emailBodyFr, createdAt |
| lead_sequence_enrollments | id, leadId, sequenceId, currentStepId, status, enrolledAt, nextEmailAt, completedAt |
| sequence_email_logs | id, enrollmentId, stepId, sentAt, opened, openedAt, clicked, clickedAt |
| crm_meetings | id, leadId, organizerId, title, description, meetingDate, durationMinutes, meetingType, meetingLink, status, notes, outcome, createdAt, updatedAt |
| crm_email_templates | id, name, subject, body, category, language, variables, isDefault, createdBy, usageCount, createdAt, updatedAt |
| crm_pipeline_notifications | id, leadId, notificationType, message, isRead, readAt, createdAt |
| crm_activity_reports | id, reportType, periodStart, periodEnd, data, generatedAt |
| crm_lead_tags | id, name, color, description, createdAt, updatedAt |
| crm_lead_tag_assignments | id, leadId, tagId, assignedAt |
| crm_tag_automation_rules | id, name, description, tagId, conditionType, conditionValue, isActive, priority, createdAt, updatedAt |
| crm_lead_segments | id, name, description, filters, filterLogic, color, isActive, createdBy, createdAt, updatedAt |
| crm_lead_history | id, leadId, userId, action, fieldName, oldValue, newValue, metadata, createdAt |
| crm_segment_alerts | id, segmentId, alertType, thresholdValue, notifyEmail, notifyWebhook, webhookUrl, recipients, isActive, lastTriggeredAt, triggerCount, createdAt, updatedAt |
| crm_segment_alert_logs | id, alertId, segmentId, leadId, eventType, message, notificationSent, createdAt |
| crm_sales_goals | id, name, description, goalType, targetValue, currentValue, period, startDate, endDate, assignedTo, status, createdBy, createdAt, updatedAt |
| crm_sales_goal_milestones | id, goalId, milestoneValue, reachedAt, notificationSent, createdAt |
| crm_team_goal_assignments | id, goalId, userId, individualTarget, currentProgress, rank, lastUpdated, createdAt |
| newsletter_subscriptions | id, email, firstName, lastName, brand, interests, language, status, source, confirmedAt, unsubscribedAt, createdAt, updatedAt |
| forum_categories | id, name, nameFr, description, descriptionFr, slug, icon, color, sortOrder, isActive, threadCount, postCount, createdAt, updatedAt |
| forum_threads | id, categoryId, authorId, title, slug, content, isPinned, isLocked, viewCount, replyCount, lastReplyAt, lastReplyById, status, createdAt, updatedAt |
| forum_posts | id, threadId, authorId, content, isEdited, editedAt, likeCount, status, createdAt, updatedAt |
| forum_post_likes | id, postId, userId, createdAt |
| community_events | id, title, titleFr, description, descriptionFr, slug, eventType, startAt, endAt, timezone, locationType, locationDetails, meetingUrl, maxCapacity, currentRegistrations, waitlistEnabled, price, hostId, hostName, status, imageUrl, createdAt, updatedAt |
| event_registrations | id, eventId, userId, status, registeredAt, cancelledAt, attendedAt, email, name, stripePaymentId, amountPaid, reminderSent, createdAt, updatedAt |
| courses | id, title, titleFr, slug, description, descriptionFr, shortDescription, shortDescriptionFr, pathCompletionBadgeUrl, thumbnailUrl, previewVideoUrl, category, level, targetLanguage, price, originalPrice, currency, accessType, accessDurationDays, totalModules, totalLessons, totalDurationMinutes, totalEnrollments, averageRating, totalReviews, instructorId, instructorName, status, publishedAt, metaTitle, metaDescription, hasCertificate, hasQuizzes, hasDownloads, dripEnabled, dripInterval, dripUnit, totalActivities, heroImageUrl, pathNumber, estimatedHours, createdAt, updatedAt |
| course_modules | id, courseId, title, titleFr, description, descriptionFr, badgeImageUrl, sortOrder, moduleNumber, totalLessons, totalDurationMinutes, isPreview, thumbnailUrl, availableAt, unlockMode, prerequisiteModuleId, status, createdAt, updatedAt |
## RBAC & Auth

- **Authentication:** User authentication is primarily handled by **Clerk**, as indicated by the `@clerk/clerk-react` dependency and the `ClerkProviderWrapper`. This manages user sessions, sign-up, sign-in, and other authentication-related functionality.

- **Authorization:** Role-Based Access Control (RBAC) is implemented through a custom middleware (`server/rbacMiddleware.ts`).
  - **Roles:** The `users` table in the database defines the following roles: `owner`, `admin`, `hr_admin`, `coach`, `learner`, and `user`.
  - **Permissions:** The `hasPermission` function checks if a user's role has the necessary permissions for a specific action on a module. Permissions are stored in the `role_permissions` database table.
  - **Protected Routes:** The `protectedProcedure` from tRPC is used to protect routes that require authentication. The `requirePermission` middleware is used to enforce role-based access to specific procedures.
  - **Protected Client-Side Routes:** The `/dashboard`, `/app/*`, `/admin/*`, and other user-specific routes are protected and will redirect to the login page if the user is not authenticated. The `DashboardRouter` component likely handles role-based rendering of the appropriate dashboard.
## UI Patterns

- **Component Library:** The project uses **shadcn/ui**, which is a collection of re-usable components built on top of **Radix UI** and styled with **Tailwind CSS**. This is evident from the `package.json` dependencies and the `components.json` file.
- **Styling:** **Tailwind CSS** is the primary styling approach, configured via the `@tailwindcss/vite` plugin in `vite.config.ts`. The project also uses `tailwindcss-animate` for animations.
- **Layout:** The application uses a combination of traditional and modern layouts. The main marketing pages have a standard layout, while the admin and user dashboards utilize a sidebar navigation layout. The use of `react-resizable-panels` suggests that some layouts may be resizable.
- **Bilingual Support:** The application supports both English and French. This is evident from the use of `LanguageProvider` and the presence of `Fr` suffixes in many component props and database columns (e.g., `headlineFr`, `bioFr`).
- **Glassmorphism:** The presence of `framer-motion` and the overall modern aesthetic suggest that glassmorphism and other advanced styling techniques might be used, although this would need to be confirmed by visual inspection.
## Unique Assets

- **`shared/audioContent.ts`**: This file contains a large, structured list of English and French phrases with corresponding audio file URLs, levels, and categories. This is a significant and unique asset for the platform's language-learning features.
- **`shared/pricing.ts`**: This file defines the pricing structure for coaching plans and courses, which is specific to this application.
- **`server/rbacMiddleware.ts`**: A custom-built RBAC and audit logging middleware, which is a unique and important part of the application's security and administration.
- **Drizzle Schema (`drizzle/schema.ts`)**: The database schema is highly specific to this application, with many custom tables and columns tailored to the platform's features.
\n### Server Procedures
\n## Repo: RusingAcademy-Learner-Portal Audit Report\n
### Client Routes
\n### Server Procedures
\n## Repo: RusingAcademy-Library Audit Report\n
### Client Routes
\n### Server Procedures
\n## Repo: RusingAcademy-Sales Repository Audit\n
### Client Routes
\n### Server Procedures
\n## Repo: RusingAcademy-KAJABI-style-Admin-Control-System Audit Report\n
### Client Routes
\n### Server Procedures
\n## Repo: RusingAcademy-Community Audit Report\n
### Client Routes

| Path | Component | Notes |
|---|---|---|
| `/` | `Home` | |
| `/thread/:id` | `ThreadDetail` | |
| `/profile/:id` | `UserProfile` | |
| `/messages` | `Messages` | |
| `/search` | `SearchResults` | |
| `/moderation` | `Moderation` | |
| `/analytics` | `Analytics` | |
| `/membership` | `Membership` | Sprint 11-20 |
| `/referrals` | `Referrals` | Sprint 11-20 |
| `/ai-assistant` | `AIAssistant` | Sprint 11-20 |
| `/channels` | `Channels` | Sprint 11-20 |
| `/certificates` | `Certificates` | Sprint 11-20 |
| `/email-broadcasts` | `EmailBroadcasts` | Sprint 11-20 |
| `/revenue` | `RevenueDashboard` | Sprint 11-20 |
| `/courses` | `CourseCatalog` | Sprint 24-25 |
| `/courses/:id` | `CoursePlayer` | Sprint 24-25 |
| `/admin/courses` | `CourseBuilder` | Admin |
| `/admin/courses/new` | `CourseBuilder` | Admin |
| `/admin/courses/:id/edit` | `CourseBuilder` | Admin |
| `/404` | `NotFound` | |
| `*` | `NotFound` | Fallback |

## Server Router Procedures

| Router | Procedure | Type (query/mutation) |
|---|---|---|
| advancedAnalytics | revenueDashboard | query |
| advancedAnalytics | engagementMetrics | query |
| advancedAnalytics | contentPerformance | query |
| advancedAnalytics | referralAnalytics | query |
| aiAssistant | correctWriting | mutation |
| aiAssistant | myHistory | query |
| aiAssistant | myProgress | query |
| aiAssistant | recommendContent | query |
| analytics | overview | query |
| analytics | topContributors | query |
| analytics | activityTimeline | query |
| analytics | courseStats | query |
| analytics | eventStats | query |
| analytics | challengeStats | query |
| certificate | myCertificates | query |
| certificate | verify | query |
| certificate | issueCertificate | mutation |
| certificate | adminList | query |
| challenges | list | query |
| challenges | get | query |
| challenges | create | mutation |
| challenges | join | mutation |
| challenges | myChallenges | query |
| channel | list | query |
| channel | getBySlug | query |
| channel | join | mutation |
| channel | leave | mutation |
| channel | myChannels | query |
| channel | members | query |
| channel | create | mutation |
| channel | update | mutation |
| classroom | listCourses | query |
| classroom | getCourse | query |
| classroom | enroll | mutation |
| classroom | myEnrollments | query |
| classroom | completeLesson | mutation |
| contentAccess | checkAccess | query |
| contentAccess | setRule | mutation |
| contentAccess | listRules | query |
| courseAdmin | list | query |
| courseAdmin | get | query |
| courseAdmin | createCourse | mutation |
| courseAdmin | updateCourse | mutation |
| courseAdmin | deleteCourse | mutation |
| courseAdmin | addModule | mutation |
| courseAdmin | updateModule | mutation |
| courseAdmin | deleteModule | mutation |
| courseAdmin | addLesson | mutation |
| courseAdmin | updateLesson | mutation |
| courseAdmin | deleteLesson | mutation |
| courseAdmin | reorderModules | mutation |
| courseAdmin | reorderLessons | mutation |
| courseAdmin | publishCourse | mutation |

## Database Tables

| Table | Columns |
|---|---|
| users | id, openId, name, email, loginMethod, role, avatarUrl, preferredLanguage, bio, createdAt, updatedAt, lastSignedIn |
| forum_categories | id, name, nameFr, description, descriptionFr, slug, icon, color, sortOrder, isActive, threadCount, postCount, createdAt, updatedAt |
| forum_threads | id, categoryId, authorId, title, slug, content, contentType, thumbnailUrl, isPinned, isLocked, viewCount, replyCount, likeCount, lastReplyAt, lastReplyById, audioUrl, audioDurationSeconds, exerciseType, difficulty, status, createdAt, updatedAt |
| forum_posts | id, threadId, authorId, content, parentId, isEdited, editedAt, likeCount, status, createdAt, updatedAt |
| thread_likes | id, threadId, userId, createdAt |
| post_likes | id, postId, userId, createdAt |
| learner_xp | id, userId, totalXp, weeklyXp, monthlyXp, currentLevel, levelTitle, currentStreak, longestStreak, lastActivityDate, streakFreezeAvailable, createdAt, updatedAt |
| xp_transactions | id, userId, amount, reason, description, referenceType, referenceId, createdAt |
| learner_badges | id, userId, badgeType, title, titleFr, description, descriptionFr, iconUrl, metadata, awardedAt, isNew |
| community_events | id, title, titleFr, description, descriptionFr, slug, eventType, startAt, endAt, timezone, location, locationUrl, hostId, capacity, registrationCount, status, coverImageUrl, createdAt, updatedAt |
| event_registrations | id, eventId, userId, status, registeredAt, attendedAt, feedbackRating, feedbackComment |
| challenges | id, name, nameFr, description, descriptionFr, type, targetCount, pointsReward, period, startAt, endAt, imageUrl, isActive, createdAt, updatedAt |
| user_challenges | id, userId, challengeId, status, currentProgress, targetProgress, periodStart, periodEnd, completedAt, pointsAwarded, createdAt, updatedAt |
| notebook_entries | id, userId, threadId, content, language, createdAt, updatedAt |
| in_app_notifications | id, userId, type, title, titleFr, message, messageFr, linkType, linkId, isRead, createdAt |
| conversations | id, participantOneId, participantTwoId, lastMessageAt, lastMessagePreview, createdAt, updatedAt |
| messages | id, conversationId, senderId, content, isRead, readAt, status, createdAt |
| polls | id, threadId, question, options, allowMultiple, endsAt, totalVotes, createdAt |
| poll_votes | id, pollId, userId, optionId, createdAt |
| content_reports | id, reporterId, contentType, contentId, reason, description, status, reviewedById, reviewedAt, resolution, createdAt, updatedAt |
| user_suspensions | id, userId, suspendedById, reason, suspendedAt, expiresAt, isActive, liftedAt, liftedById, createdAt |
| membership_tiers | id, name, nameFr, slug, description, descriptionFr, priceMonthly, priceYearly, currency, stripePriceIdMonthly, stripePriceIdYearly, stripeProductId, features, featuresFr, maxCourses, maxDMs, canAccessPremiumContent, canCreateEvents, canAccessAnalytics, badgeLabel, badgeColor, sortOrder, isActive, createdAt, updatedAt |
| user_subscriptions | id, userId, tierId, stripeCustomerId, stripeSubscriptionId, status, billingCycle, currentPeriodStart, currentPeriodEnd, cancelAtPeriodEnd, canceledAt, trialEndsAt, createdAt, updatedAt |
| payment_history | id, userId, subscriptionId, stripePaymentIntentId, stripeInvoiceId, amount, currency, status, description, createdAt |
| content_access_rules | id, contentType, contentId, requiredTierId, dripDelayDays, isActive, createdAt |
| referrals | id, referrerId, referralCode, referredUserId, status, clickCount, conversionCount, commissionAmount, createdAt, updatedAt |
| ai_corrections | id, userId, originalText, correctedText, language, detectedLevel, corrections, grammarScore, styleScore, overallScore, feedback, feedbackFr, createdAt |
| channels | id, name, nameFr, slug, description, descriptionFr, visibility, requiredTierId, createdById, memberCount, threadCount, sortOrder, isActive, createdAt, updatedAt |
| channel_memberships | id, channelId, userId, role, joinedAt |
| courses | id, title, titleFr, slug, shortDescription, description, descriptionFr, category, level, targetLanguage, price, accessType, thumbnailUrl, instructorId, instructorName, totalModules, totalLessons, totalDurationMinutes, totalEnrollments, averageRating, totalReviews, hasCertificate, status, publishedAt, createdAt, updatedAt |
| course_modules | id, courseId, title, titleFr, description, sortOrder, isPreview, createdAt, updatedAt |
| lessons | id, courseId, moduleId, title, titleFr, description, contentType, videoUrl, textContent, audioUrl, sortOrder, estimatedMinutes, isPreview, isMandatory, createdAt, updatedAt |
| course_enrollments | id, userId, courseId, status, progressPercent, lessonsCompleted, totalLessons, enrolledAt, completedAt, lastAccessedAt |
| lesson_progress | id, userId, courseId, moduleId, lessonId, status, progressPercent, completedAt, lastAccessedAt, notes |

## RBAC & Auth

The repository uses a role-based access control (RBAC) system built on top of tRPC procedures. Authentication is handled through session cookies, and authorization is enforced by different types of procedures.

### Roles

The following user roles are defined in the `drizzle/schema.ts` file within the `users` table:

- **user**: The default role for any authenticated user.
- **admin**: Has full access to all protected and admin procedures.
- **coach**: A role that is defined but does not seem to be used in any of the tRPC procedures to restrict access.
- **learner**: A role that is defined but does not seem to be used in any of the tRPC procedures to restrict access.

### Authorization

Authorization is implemented using tRPC middleware, which creates three types of procedures:

- **`publicProcedure`**: These procedures do not require any authentication and can be accessed by anyone.
- **`protectedProcedure`**: These procedures require the user to be authenticated. The middleware checks for the presence of a `user` object in the tRPC context (`ctx.user`). If the user is not authenticated, a `UNAUTHORIZED` error is thrown.
- **`adminProcedure`**: These procedures are the most restrictive and require the user to be both authenticated and have the `admin` role. The middleware checks if `ctx.user.role` is equal to `'admin'`. If the user is not an admin, a `FORBIDDEN` error is thrown.

### Protected Routes

Many of the server procedures are protected using either `protectedProcedure` or `adminProcedure`. Here are some examples:

- **Admin-Only Procedures**:
    - `advancedAnalytics.revenueDashboard`
    - `advancedAnalytics.engagementMetrics`
    - `analytics.overview`
    - `courseAdmin.createCourse`
    - `channel.create`

- **Authenticated User Procedures**:
    - `aiAssistant.correctWriting`
    - `certificate.myCertificates`
    - `challenges.join`
    - `classroom.enroll`
    - `forum.createThread`

## UI Patterns

### Design System & Component Library

The project utilizes a design system based on **shadcn/ui**, a collection of reusable UI components for React. This is evident from the component files found in `client/src/components/ui/`, which closely match the naming and structure of shadcn/ui components. Radix UI is likely used as the underlying headless component library, as it is a common foundation for shadcn/ui.

### Styling

**Tailwind CSS** is the primary styling approach, as indicated by the presence of `tailwind.config.js` and `postcss.config.js`. This utility-first CSS framework is used to build the visual appearance of the components and layouts.

### Layout Patterns

The main application layout is defined in `client/src/components/DashboardLayout.tsx`. It consists of a `TopHeader`, a `LeftSidebar`, and a main content area. This is a common pattern for dashboard-style applications, providing consistent navigation and structure across different pages.

### Bilingual Support

The application supports both English and French. The internationalization (i18n) is managed through files in the `client/src/i18n/` directory, including `en.ts` and `fr.ts` for the language strings, and a `LocaleContext.tsx` to provide the current locale to the application.

### Glassmorphism

While not explicitly found in the code, the use of glassmorphism is a stated preference of the user. It's possible that this effect is achieved through custom Tailwind CSS classes or inline styles that combine background blur and transparency, but a quick scan of the code did not reveal any obvious implementations. It's a design preference to be aware of for future development.

## Unique Assets

- **`server/seed.mjs`**: This file contains a large amount of seed data for the database, including forum categories, threads, courses, and membership tiers. This data is specific to the RusingAcademy brand and provides a realistic starting point for the community hub.

- **`client/src/lib/data.ts` and `client/src/lib/extendedData.ts`**: These files contain static data used throughout the client-side application. `data.ts` includes information about user personas, events, and notifications. `extendedData.ts` contains more detailed data for the component showcase, such as chat history and user profiles.

- **`server/sprints*.test.ts`**: A series of test files (`sprints11-20.test.ts`, `sprints21-23.test.ts`, `sprints24-25.test.ts`) that seem to be related to specific development sprints. These could contain valuable information about the features and changes implemented during those sprints.

- **`patches/wouter@3.7.1.patch`**: A patch file for the `wouter` routing library. This indicates that a specific customization or fix has been applied to the library, which is a unique aspect of this repository.
\n### Server Procedures
