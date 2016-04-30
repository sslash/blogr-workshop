import React from 'react';
import req from 'axios';
import { loadPostsResponse } from '../actions/PostServerActions';

export function loadPostsFromServer() {
    req.get('/posts')
    .then((response) => {
        loadPostsResponse(response);
    })
    .catch(() => {
        console.log("Something went wrong");
    });
}