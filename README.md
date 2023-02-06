# Notion CMS Graphql

## Description

A server that provides Graphql API for Notion

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Integration guide

- **Note for FE dev** Your request would need a header which is the name of our client. E.g

```json
{
  "NotionClientName": "Hector"
}
```
