
const EVENTS = {
  USER_REGISTERED: "user.registered.v1",
  POST_CREATED:    "post.created.v1",
  POST_LIKED:      "post.liked.v1",
  POST_DELETED:    "post.deleted.v1",
  FOLLOW_CREATED:  "follow.created.v1",
  FOLLOW_REMOVED:  "follow.removed.v1",
  MEDIA_UPLOADED:  "media.uploaded.v1",
};

const EventFactory = {
  userRegistered: (userId, username, email) => ({
    eventType: EVENTS.USER_REGISTERED,
    version: 1,
    occurredAt: new Date().toISOString(),
    payload: { userId, username, email },
  }),

  postCreated: (postId, authorId, content, mediaUrls = []) => ({
    eventType: EVENTS.POST_CREATED,
    version: 1,
    occurredAt: new Date().toISOString(),
    payload: { postId, authorId, content, mediaUrls },
  }),

  postLiked: (postId, likedBy, authorId) => ({
    eventType: EVENTS.POST_LIKED,
    version: 1,
    occurredAt: new Date().toISOString(),
    payload: { postId, likedBy, authorId },
  }),

  followCreated: (followerId, followeeId) => ({
    eventType: EVENTS.FOLLOW_CREATED,
    version: 1,
    occurredAt: new Date().toISOString(),
    payload: { followerId, followeeId },
  }),
};

module.exports = { EVENTS, EventFactory };