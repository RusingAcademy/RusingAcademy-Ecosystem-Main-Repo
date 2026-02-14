# DB Schema Map\n\nThis document maps all database tables and their columns from all 6 repositories.\n
\n## Repo: rusingacademy-ecosystem\n
\n## Repo: RusingAcademy-Learner-Portal Audit Report\n
\n## Repo: RusingAcademy-Library Audit Report\n
\n## Repo: RusingAcademy-Sales Repository Audit\n
\n## Repo: RusingAcademy-KAJABI-style-Admin-Control-System Audit Report\n
\n## Repo: RusingAcademy-Community Audit Report\n

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

