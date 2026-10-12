
# MonadMeet

### Decentralized Video Meetings Powered by Monad

MonadMeet is a Web3 video meeting application that combines real-time video communication with blockchain-based meeting management on the **Monad Testnet**. It brings together familiar online meeting features and on-chain participant authorization and attendance tracking.

**Live Demo:** [MonadMeet](https://monad-meet.vercel.app)  
**Backend:** [MonadMeet API](https://monadmeet-backend.onrender.com)  
**Smart Contract:** [View on Monad Explorer](https://testnet.monadexplorer.com/address/0x7dFc511c776B5Be2B9c6e3014df9413A25d6c357)

---

## ✨ Features

- **Create Meetings:** Create a meeting and generate a unique meeting code.
- **Join Meetings:** Join an existing meeting using its code.
- **Real-Time Communication:** Video meeting functionality powered by web technologies.
- **Wallet Connection:** Connect MetaMask to interact with Monad Testnet.
- **On-Chain Meeting Creation:** Create meeting records through a deployed smart contract.
- **Participant Authorization:** Allow the meeting owner to authorize participant wallet addresses.
- **Attendance Tracking:** Record participant attendance on-chain.
- **Full-Stack Architecture:** React frontend, Express backend, and MongoDB persistence.

> Note: Blockchain transactions require a compatible wallet connected to Monad Testnet. On-chain meeting creation and the complete meeting workflow should be tested end-to-end before being considered fully verified.

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- JavaScript
- Axios
- Socket.IO Client
- WebRTC
- ethers.js

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO

### Blockchain
- Solidity
- Hardhat
- ethers.js
- MetaMask
- Monad Testnet

---

## 🏗️ Architecture

```text
                 ┌──────────────────────┐
                 │      React UI        │
                 │   Video Meetings     │
                 └──────────┬───────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
       ┌──────▼───────┐          ┌────────▼────────┐
       │ Express API  │          │ MetaMask Wallet │
       │ Socket.IO    │          │ ethers.js       │
       └──────┬───────┘          └────────┬────────┘
              │                           │
       ┌──────▼───────┐          ┌────────▼────────┐
       │   MongoDB    │          │ Monad Smart     │
       │ Meeting Data │          │ Contract        │
       └──────────────┘          └─────────────────┘
```

---

## ⛓️ Monad Testnet Configuration

| Setting | Value |
|---|---|
| Network | Monad Testnet |
| Chain ID | `10143` |
| RPC URL | `https://testnet-rpc.monad.xyz` |
| Explorer | [Monad Testnet Explorer](https://testnet.monadexplorer.com) |
| Contract Address | `0x7dFc511c776B5Be2B9c6e3014df9413A25d6c357` |

Make sure MetaMask is connected to Monad Testnet before using blockchain features.

---

## 🚀 Getting Started

### Prerequisites

Install the following:

- Node.js and npm
- MongoDB instance
- MetaMask browser extension
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Asha-punia/MonadMeet.git
cd MonadMeet
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` and configure the variables expected by the backend, for example:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
```

Add any other environment variables required by your backend configuration.

Start the backend:

```bash
npm run dev
```

If your project uses a different development script, check `backend/package.json`.

### 3. Set Up the Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
VITE_API_URL=http://localhost:8000
```

Start the frontend:

```bash
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

### 4. Connect MetaMask

1. Open the application.
2. Connect MetaMask when prompted.
3. Switch to Monad Testnet (Chain ID `10143`).
4. Ensure the wallet has enough testnet MON for transaction fees.
5. Approve blockchain transactions when MetaMask prompts you.

---

## 📜 Smart Contract

The deployed `MeetingManager` contract supports meeting management operations, including:

| Function | Purpose |
|---|---|
| `createMeeting()` | Creates a new on-chain meeting |
| `meetingCount()` | Returns the meeting count |
| `meetingOwner(meetingId)` | Reads the meeting owner's address |
| `authorizeParticipant(meetingId, participant)` | Authorizes a participant wallet |
| `recordAttendence(meetingId)` | Records attendance for an authorized participant |
| `closeMeeting(meetingId)` | Closes a meeting |
| `createDecision(meetingId, ...)` | Creates a meeting decision |
| `recordApproval(meetingId, ...)` | Records an approval |
| `storeMeetingProof(meetingId, ...)` | Stores meeting proof |

Function signatures and access restrictions are defined by the deployed contract. The spelling `recordAttendence` matches the current contract interface.

**Contract address:**  
`0x7dFc511c776B5Be2B9c6e3014df9413A25d6c357`

---

## 📁 Project Structure

```text
MonadMeet/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── blockchain/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   ├── .env
│   └── package.json
├── contracts/
│   └── ...
└── README.md
```

---

## 🔍 Troubleshooting

### MetaMask does not open or respond
- Check whether a MetaMask transaction confirmation is already waiting.
- Open the MetaMask extension and inspect pending activity.
- Confirm that the selected network is Monad Testnet.
- Check your testnet MON balance.
- Check the browser console for errors.

### Meeting creation appears stuck
- Inspect the browser console for the last logged step.
- If the transaction was submitted, look for its hash in the Monad Explorer.
- Do not repeatedly submit transactions while an earlier transaction may still be pending.

### Frontend cannot reach the backend
- Verify that the backend is running.
- Check `VITE_API_URL` in the frontend environment.
- For local development, use `http://localhost:8000`.
- After changing Vercel environment variables, redeploy the frontend.

---

## 🧪 Testing Status

The frontend and backend have been deployed, and the smart contract is available on Monad Testnet.

Before treating the complete workflow as verified, test:

- [ ] Connect MetaMask to Monad Testnet.
- [ ] Create a blockchain meeting and confirm the transaction.
- [ ] Save the meeting details through the backend.
- [ ] Join the meeting using its generated code.
- [ ] Authorize a participant wallet.
- [ ] Record attendance from an authorized participant wallet.
- [ ] Test video and audio communication between participants.

---

## 🔮 Future Improvements

- Meeting verification and on-chain proof.
- Improved transaction status and error handling.
- Better meeting-owner and participant permissions in the interface.
- More comprehensive integration testing.
- Enhanced user experience for wallet connection and network switching.

---

## 🤝 Contributing

Contributions, bug reports, and suggestions are welcome. Fork the repository, create a feature branch, and submit a pull request.

---

## 📄 License

Add the appropriate license for this project before distributing it for reuse.
