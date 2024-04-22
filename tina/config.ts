import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "static",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "static",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "content/posts",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
      {
        name: "rule",
        label: "Rules",
        path: "content/rules",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "uri",
            required: true,
            label: "Uri (keep it short e.g. /my-url)",
            ui: {
              validate: (value, data) => {
                if (!isValidUri(value)) {
                  return 'Not a valid URI - use snakecase (e.g. my-url)'
                }
              }
            }
          },
          {
            label: 'Author',
            name: 'author',
            type: 'object',
            fields: [
              {
                type: "string",
                name: "name",
                label: "Name",
                isTitle: true,
                required: true,
              },
              {
                type: "string",
                name: "url",
                label: "url (prefferable SSW.People)",
                required: true,
              },
            ],
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
          {
            label: 'Related Rules',
            name: 'related',
            type: 'reference',
            collections: ['rule'],
          },
          {
            label: 'Redirects (old URIs)',
            name: 'redirects',
            type: 'string',
            list: true,
            description: 'If the rule is archived',
          },
          {
            label: 'Archived reason',
            name: 'archiveReason',
            type: 'string',
            required: false,
            description: 'Reason for archiving (prefferably link to a new rule)'
          },
          {
            label: 'Id',
            name: 'guid',
            type: 'string',
            required: true,
            description: 'Unique ID for the rule - dont change this after creation'
          }
        ],
      }
    ],
  },
});

function isValidUri(uri: string): boolean {
  return /^[a-z0-9-]+$/i.test(uri);
}
