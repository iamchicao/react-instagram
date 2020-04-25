import React, { useReducer, useEffect } from "react";

import Stories from "../../containers/Stories";
import Loading from "../../components/Loading";

import Posts from "../../containers/Posts";

import "./FeedRoute.scss";

const INITIAL_STATE = {
  users: [],
  posts: [],
  stories: [],
  usersFetched: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_USERS": {
      return { ...state, users: action.payload };
    }

    case "UPDATE_POSTS": {
      return { ...state, posts: action.payload };
    }

    case "UPDATE_STORIES": {
      return { ...state, stories: action.payload };
    }

    case "UPDATE_USERS_FETCHED": {
      return { ...state, usersFetched: action.payload };
    }

    default:
      return state;
  }
};

const FeedRoute = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const { users, posts, stories, usersFetched } = state;

  const getUserPostById = (postUserId) =>
    users.find((user) => postUserId === user.id);

  useEffect(() => {
    fetch(`https://5e7d0266a917d70016684219.mockapi.io/api/v1/users`)
      .then((res) => res.json())
      .then((data) =>
        dispatch({
          type: "UPDATE_USERS",
          payload: data,
        })
      );
  }, []);

  useEffect(() => {
    if (usersFetched === users.length) {
      return;
    }

    fetch(`https://5e7d0266a917d70016684219.mockapi.io/api/v1/users/${users[usersFetched].id}/posts`)
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE_POSTS",
          payload: [...posts, ...data],
        });

        dispatch({
          type: "UPDATE_USERS_FETCHED",
          payload: usersFetched + 1,
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, usersFetched]);

  useEffect(() => {
    fetch("https://5e7d0266a917d70016684219.mockapi.io/api/v1/stories")
      .then((res) => res.json())
      .then((data) =>
        dispatch({
          type: "UPDATE_STORIES",
          payload: data,
        })
      );
  }, [users]);

  return (
    <div data-testid="feed-route">
      {users.length > 0 && stories.length > 0 && (
        <Stories stories={stories} getUserHandler={getUserPostById} />
      )}

      {users.length !== usersFetched ? (
        <Loading />
      ) : (
        <Posts posts={posts} getUserHandler={getUserPostById} />
      )}
    </div>
  );
};

export default FeedRoute;