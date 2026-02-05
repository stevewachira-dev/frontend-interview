## Hi!
![hippo](https://media3.giphy.com/media/aUovxH8Vf9qDu/giphy.gif)
## So lot's of new changes added to the challenge
In addition to completing the main requirements set at (https://github.com/youth-inc/frontend-interview/tree/main?tab=readme-ov-file#frontend-interview) I added a custom MCP to handle guidelines, servers and regular MCPs for Next.js & Tailwind from Context7 - (https://context7.com/)

Have a look at the MCP folder for a deeper look at the process (well documented)
<br>
<br>
<br>
<br>

## And the best part?
We got AUTOMATED tests using the MCP! Have a look at the results!

![hippo](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdDF2bDdjNnliNnBqdGMya3B0bmsyZmo1M2cwYjlpZnRvb2w3OHlpbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/z835RsRqQHOlC4rsBr/giphy.gif)

(https://stirring-boba-c13c1b.netlify.app/)

## You wanna test the app?
  Steps:

  1. Clone and install the app
  ```
  git clone <repo-url>
  cd frontend-interview
  npm install
  ```

  2. Run it
  ```
  npm run dev   # http://localhost:3000
  ```

  3. Run tests (optional)
  ```
  npm test                # plain run
  npm run test:coverage   # with coverage report
  npm run test:report     # coverage + opens HTML report in browser
  ```
  The test:report script uses open, which is macOS-specific, it won't work on Linux/Windows as-is.

  4. Set up the MCP (optional, Claude Code only)
  ```
  cd mcp
  chmod +x setup.sh
  ./setup.sh  # installs mcp deps, prints the claude mcp add command
  ```            
  copy-paste the command it prints, then restart Claude Code

  ---
  One thing worth noting for the repo as it stands:

  1. test:report uses open (package.json:13), which is macOS-only. If anyone on the team uses Linux, that script will
  fail. xdg-open is the Linux equivalent — worth a note somewhere, or a cross-platform approach if it matters.

## Feedback from me about the test.
Although it was pretty overkill building an MCP for this, it was still a fun exercise to do and I had a good time working on it.
<br>
<br>
<br>
<br>

## That's pretty much it. Thanks for coming to my TED Talk
![hippo](https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbGUwdGVlOG1wNnNzOG44eTk4YXJpdDVhZTRyeTBzMHhpcmdlYmQycSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2UJvTeZySHq3LscGqy/giphy.gif)