# Dockerfile for React + TypeScript + Redux + Tailwind CSS Project

# Step 1: Base Image
FROM node:20.16.0

# Step 2: Set Working Directory
WORKDIR /usr/src/app

# Step 3: Copy Package Files
COPY package*.json ./

# Step 4: Install Dependencies
RUN npm install

# Step 5: Copy Application Code
COPY . .

# Step 6: Build Application
RUN npm run build

# Step 7: Expose Port
EXPOSE 3000

# Step 8: Run Application
# Serve the build directory instead of starting the development server
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "3000"]