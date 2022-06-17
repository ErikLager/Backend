const rootURL = "/api/";

const registerUser = async () => {
    const username = document.querySelector("#register-username").value;
    const password = document.querySelector("#register-password").value;

    const user = {
        username,
        password,
    };
    try {
        const res = await fetch(`${rootURL}register`, {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json();
        console.log(data);

    } catch (error) {
        console.error("Error: ", error);
    };

    document.querySelector("#register-username").value = "";
    document.querySelector("#register-password").value = "";
};

const LoginUser = async () => {
    const username = document.querySelector("#Login-username").value;
    const password = document.querySelector("#Login-password").value;

    const user = {
        username,
        password,
    };

    try {
        const res = await fetch(`${rootURL}login`, {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json"
            },
        })
        if (res.status !== 401) {
            const data = await res.json();
            console.log(data)
        } else {
            throw "Wrong username or password"
        }

    } catch (error) {
        console.error("Error: ", error);
    }

    document.querySelector("#Login-username").value = "";
    document.querySelector("#Login-password").value = "";
};

// Check if user is logged in
const checkLoggedinStatus = async () => {
    try {
        const res = await fetch(`${rootURL}authenticated`);
            if (res.status !== 401){
                const data = await res.json();
                console.log(data);
                console.log("You are logged in")
            }else{
                throw "You are not logged in"
            }
    } catch (error) {
        console.error("Error: ", error)
    }
}

const logOut = async() => {
    try {
        const res = await fetch(`${rootURL}logout`);
        if (res.status !== 401){
            const data = await res.json();
            console.log(data)
        }else{
            throw "You are already logged out ya' ove' grown banana"
        }
    } catch (error) {
        console.error("Error: ", error)
    }
}