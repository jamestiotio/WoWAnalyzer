import React from 'react';

// https://thenounproject.com/term/duration/370713/
// duration by Bohdan Burmich from the Noun Project
const Icon = ({ ...other }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="10 10 80 80"
    className="icon"
    {...other}
  >
    <path d="M50,86.4865c17.4361,0,31.6216-14.1855,31.6216-31.6216c0-16.6168-12.8865-30.2714-29.1892-31.5189v-4.9677h7.2973v-4.8649  H40.2703v4.8649h7.2973v4.9677c-16.3027,1.2475-29.1892,14.902-29.1892,31.5189C18.3784,72.3009,32.5639,86.4865,50,86.4865z M52.4324,28.2236c3.1101,0.2817,6.0664,1.0982,8.7798,2.356l-8.7798,15.2073V28.2236z M47.5676,28.2236v26.6412 c0,1.1008,0.7393,2.0647,1.8029,2.3497c0.209,0.0561,0.4205,0.0827,0.6295,0.0827c0.8533,0,1.6642-0.4504,2.1065-1.2162 l13.3146-23.0616c6.8507,4.8503,11.3357,12.8315,11.3357,21.8454c0,14.7537-12.0031,26.7567-26.7568,26.7567 s-26.7568-12.003-26.7568-26.7567C23.2432,40.9315,33.9501,29.4573,47.5676,28.2236z" />
  </svg>
);

export default Icon;
