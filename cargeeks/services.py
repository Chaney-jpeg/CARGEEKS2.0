from .repositories import PostRepository, ProfileRepository, SocialRepository, UserRepository


class CarGeeksService:
    def __init__(
        self,
        users: UserRepository,
        posts: PostRepository,
        profiles: ProfileRepository,
        social: SocialRepository,
    ) -> None:
        self.users = users
        self.posts = posts
        self.profiles = profiles
        self.social = social

    def dashboard_payload(self) -> dict:
        return {
            "active_geeks": self.users.count_users(),
            "featured": self.posts.list_featured(),
            "recent": self.posts.list_recent(),
        }

    def post_detail_payload(self, post_id: int) -> dict:
        return {
            "post": self.posts.get_post_detail(post_id),
            "comments": self.posts.list_comments(post_id),
        }

    def profile_payload(self, user_id: int) -> dict:
        return {
            "user": self.users.get_by_id(user_id),
            "stats": self.profiles.stats(user_id),
            "garage": self.profiles.garage(user_id),
            "activity": self.profiles.recent_activity(user_id),
            "following": self.social.following(user_id),
        }

    def for_you_payload(self, user_id: int, interests: list[str]) -> dict:
        return {
            "recommended": self.posts.list_for_interest(interests),
            "following": self.social.following(user_id),
            "suggested": self.social.suggested(user_id),
        }
