## How the Endpoints work
- [x] `(POST) /v1/posts`

This is a single endpoint that can processe the multiple variations of a post creation: Post, Repost and Quote.

Take a look at the Postman collection to see the available parameters and response examples.

- `userUuid` - User UUID existent at the database.
  - It is used to attach a kind of post to the user;
  - Is required.
- `content` - Is the content of the Post or Quote Post. Is nullable.
  - Should always be present at the request;
  - For Quotes should be filled;
  - For Reposts should be a empty string.
- `repostedUuid` - It is the original post uuid that is gona be reposted.
  - Required when creating a Quote or Repost.

🚩 Basically, the diference between Quote and Repost is the `content` field.

<br>

- [x] `(GET) /v1/posts`

Listing endpoint accepts all the expected filters bellow or non of them:

- `userUuid`- filter by posts created by some User.
  - At the profile page, can be used with the `take` to limit the retrivied posts of someone;
  - At the Homepage, can be used to filter by "All/Only mine" posts;
- `dateFrom` and `dateTo`: expects this date format: `Y-m-d`. Ex.: 2022-08-05
 - Can be used separately
- `page`: As the results are paginated, it indicates the page that should be retrivied.
 - Numeric, starts from 1.
- `take`: Limits the quantity of records that should be retrivied from the database.


🚩 Each returned record has the attribute `type` that identifies the post type.

<br>

- [x] `(GET) /v1/users/:uuid`

The only feature available for users is listing his profile details.

- `uuid`- Attach the user uuid a the URL to retrieve his profile.

#### Database

Table migrations should not be easy to understand. Besides the implemented DTOs that make the request validations, you should check the created tables to see some aspects of business rules.

Path to migration files:

- `/src/database/migrations`

## Business rules

#### Posts
- [x] A user is not allowed to post more than 5 posts in one day (including reposts and quote posts)
- [x] Posts can have a maximum of 777 characters
- [x] Users cannot update or delete their posts - we don't have this feature, mass assignment isn't a problem here.
- [x] Reposting: Users can repost other users' posts (like Twitter Retweet), limited to original posts and quote posts (not reposts)
- [x] Quote-post: Users can repost other user's posts and leave a comment along with it (like Twitter Quote Tweet) limited to original and reposts (not quote-posts)

#### Users

- [x] Only alphanumeric characters can be used for username. **Can't be validated without CRUD but was enforced at the database**
- [x] Maximum 14 characters for username;
- [x] Usernames should be unique values;

#### When at the Homepage

- [x] The homepage, by default, will show a feed of posts (including reposts and quote posts), starting with the latest 10 posts. Older posts are loaded on-demand on chunks of 10 posts whenever the user scrolling reaches the bottom of the page. **Atended by the post listing endpoint**;
- [x] There is a toggle switch "All / Only mine" that allows you to switch between seeing all posts and just posts you wrote. For both views, all kinds of posts are expected on the feed (original posts, reposts, and quote posts). **Atended by the post listing endpoint**;
- [x] There is a date range filter option (start date and end date) that allows results filtering based on the posted date, both values are optional: e.g user may want to filter only posts after a certain date without defining a limit date. **Atended by the post listing endpoint**;
- [x] New posts can be written from this page. **Posts can be written form any page, just pass the logged User uuid**.

#### When at the User profile page

- [x] Shows data about the user (**Atended by the user listing endpoint**):
    - [x] Username
    - [x] Date joined at the platform, formatted as such: "March 25, 2021"
    - [x] Count of number of posts the user has made (including reposts and quote posts)
- [x] Shows a feed of the posts the user has made (including reposts and quote posts), starting with the latest 5 posts. Older posts are loaded on-demand when the user clicks on a button at the bottom of the page labeled "show more". **Atended by the post listing endpoint**
- [x] New posts can be written from this page: for this assessment, when writing a post from the profile screen, the profile user should be set as the author of the new content. **Posts can be written form any page, just pass the logged User uuid**.
