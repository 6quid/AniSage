# Discord Bot Project

A feature-rich Discord bot built with TypeScript and Discord.js, designed to provide anime-related functionalities, daily waifu updates, and more. This bot includes commands for fetching trending anime, getting detailed anime information, and scheduling daily tasks using cron jobs.

## Features

- Fetch trending anime
- Get detailed anime information
- Daily waifu updates
- Scheduled tasks using cron jobs

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your_username/your_repository_name.git
   cd YOUR_REPOSITORY_NAME

2. Install dependencies

    ```sh
    npm install

3. Create a `.env` file in the root directory and add your environment variables in the following format:

    ```env
    DISCORD_TOKEN=your_discord_token
    CLIENT_ID=your_client_id
    CHANNEL_ID=your_channel_id
    ```
    
    Note: `WAIFU_API_TOKEN` is used to authenticate requests to the Waifu API for fetching waifu images and information.
    WAIFU_API_TOKEN=your_waifu_api_token


    Example `.env` file:

    ```env
    DISCORD_TOKEN=abc123
    CLIENT_ID=1234567890
    CHANNEL_ID=0987654321
    WAIFU_API_TOKEN=waifu123token
    ```

4. Build the project:
    ```sh
    npm run build

5. Start the bot:
    ```sh
    npm start

## Usage

- Use the `/animeinfo` command to get detailed information about a specific anime.
- Use the `/trending` command to fetch the current trending anime.
- The bot will automatically send a random waifu to the specified channel every day at 9 AM (UTC).
- The bot will also check for airing anime every midnight (UTC) and send updates to the specified channel.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

