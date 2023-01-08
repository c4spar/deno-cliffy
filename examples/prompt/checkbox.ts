#!/usr/bin/env -S deno run

import { Checkbox } from "../../prompt/checkbox.ts";

const title: Array<string> = await Checkbox.prompt({
  message: "Pick some books",
  search: true,
  maxBreadcrumbItems: 2,
  options: [
    {
      name: "Fantasy",
      value: "",
      options: [
        {
          name: "Harry Potter",
          value: "",
          options: [
            "Harry Potter and the Philosopher's Stone",
            "Harry Potter and the Chamber of Secrets",
            "Harry Potter and the Prisoner of Azkaban",
            "Harry Potter and the Goblet of Fire",
            "Harry Potter and the Order of the Phoenix",
            "Harry Potter and the Half-Blood Prince",
            "Harry Potter and the Deathly Hallows",
          ],
        },
        {
          name: "Middle-Earth",
          value: "",
          options: [
            "The Hobbit",
            {
              name: "The Lord of the Rings",
              value: "",
              options: [
                "The Fellowship of the Ring",
                "The Two Towers",
                "The Return of the King",
              ],
            },
            "Silmarillion",
          ],
        },
      ],
    },
    {
      name: "Young Adult",
      value: "",
      options: [
        {
          name: "The Hunger Games-series",
          value: "",
          options: [
            "The Hunger Games",
            "Catching Fire",
            "Mockingjay",
            "The Ballad of Songbirds and Snakes",
          ],
        },
        "The Fault in Our Stars",
      ],
    },
    {
      name: "Classic",
      value: "",
      options: [
        "Moby-Dick",
        "Pride and Prejudice",
        "To Kill a Mockingbird",
        "Brave New World",
      ],
    },
  ],
});

console.log({ title });
