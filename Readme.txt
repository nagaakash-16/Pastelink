Pastebin Lite Application

>  Project Description:
This is a basic Pastebin-like web application where users can create text pastes and share a unique URL to view them.  
Each paste can optionally have:
- A time-based expiry (TTL)
- A maximum view limit

Once the paste expires or exceeds the view limit, it becomes unavailable.

This project was undertaken as a take-home assignment to show full-stack development, API design, persistence handling, and deployment readiness.

> Features:
- Make a paste with optional TTL and max views
- Create a shareable URL for each paste
- Display paste content through API and UI
- Paste will auto-expire based on time or view count
- Health check API endpoint
- Paste content will be safely rendered (no script execution)
- Storage of pastes using a JSON file (for demo purposes only)

> Tech Stack

- Backend: Node.js, Express.js  
- Frontend: HTML, CSS, JavaScript  
- Persistence: File-based JSON storage (`db.json`)  
- UUID Generation: Node.js Crypto `randomUUID()`  
- Deployment Ready: Can be deployed to Vercel / Render / Railway