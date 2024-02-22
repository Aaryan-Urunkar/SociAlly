const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = {
    API_KEY: process.env.API_KEY
};

const genAI = new GoogleGenerativeAI(config.API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-pro" });


let history = [];

async function getResponse(prompt) {
    const chat = await model.startChat({ history: history });
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    console.log(text);
    return text;
}

const userDiv = (data) => {
    return `
    <div class="flex items-center gap-2 justify-start">
        <img
            src="user.jpg"
            alt="user icon"
            class="w-10 h-10 rounded-full"
        />
        <p class="bg-gemDeep text-white p-1 rounded-md shadow-md  ">
            ${data}
        </p>
    </div>
    `;
};

const aiDiv = (data) => {
    return `
    <div class="flex gap-2 justify-end">
        <p class="bg-gemRegular/40 text-gemDeep p-1 rounded-md shadow-md whitespace-pre-wrap">
            ${data}
        </p>
        <img
            src="chat-bot.jpg"
            alt="user icon"
            class="w-10 h-10 rounded-full"
        />
    </div>
    `;
};

let loadInterval;

function loader(item) {
    item.textContent = "";

    loadInterval = setInterval(() => {
        item.textContent += ".";

        if (item.textContent === "....") {
            item.textContent = "";
        }
    }, 300);
}

function streamText(item, text) {
    let index = 0;
    let interval = setInterval(() => {
        if (index < text.length) {
            item.innerHTML += text.charAt(index);
            index++;
        } else {
            clearInterval(interval);
        }
    }, 20);
}

async function handleSubmit(event) {
    event.preventDefault();

    let userMessage = document.getElementById("prompt");
    const chatArea = document.getElementById("chat-container");

    var prompt = userMessage.value.trim();
    if (prompt === "") {
        return;
    }

    chatArea.innerHTML += userDiv(prompt);
    userMessage.value = "";

    const aiResponseDiv = document.createElement("div");
    aiResponseDiv.innerHTML = `
    <div class="flex gap-2 justify-end">
        <p class="bg-gemRegular/40 text-gemDeep p-1 rounded-md shadow-md whitespace-pre-wrap">
        </p>
        <img
            src="chat-bot.jpg"
            alt="user icon"
            class="w-10 h-10 rounded-full"
        />
    </div>
`;
    chatArea.appendChild(aiResponseDiv);

    const pTag = aiResponseDiv.querySelector("p");
    loader(pTag);

    const aiResponse = await getResponse(prompt);
    if (aiResponse !== null) {
        clearInterval(loadInterval);
        pTag.innerText = "";
        streamText(pTag, aiResponse);

        let newUserRole = {
            role: "user",
            parts: prompt,
        };
        let newAIRole = {
            role: "model",
            parts: aiResponse,
        };

        history.push(newUserRole);
        history.push(newAIRole);
    } else {
        aiResponseDiv.innerHTML = aiDiv(" An error occured.");
    }
}

const chatForm = document.getElementById("chat-form");

chatForm.addEventListener("submit", handleSubmit);

chatForm.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) handleSubmit(event);
});
