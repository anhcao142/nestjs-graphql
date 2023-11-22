# ---- Base Node ----
FROM node:20-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./

# ---- Dependencies ----
FROM base AS dependencies
RUN npm install --production
# copy production node_modules aside for later usage
RUN cp -R node_modules prod_node_modules
# install ALL node_modules, including 'devDependencies'
RUN npm install

# ---- Copy Files/Build ----
FROM dependencies AS build
COPY . .
RUN npm run build

# ---- Release ----
FROM base AS release
# copy production node_modules
COPY --from=dependencies /usr/src/app/prod_node_modules ./node_modules
# copy app sources
COPY --from=build /usr/src/app/dist ./dist
# Expose the application on port 3000
EXPOSE 3000
# Start the application
CMD ["node", "dist/main"]
