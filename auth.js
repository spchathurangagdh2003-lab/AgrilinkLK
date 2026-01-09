const apiUrl = 'http://localhost:5000/api/auth';

const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const FullName = document.getElementById('fullname').value.trim();
        const Email = document.getElementById('email').value.trim();
        const Password = document.getElementById('password').value.trim();
        const Role = document.getElementById('role').value;
        const Phone = document.getElementById('phone').value.trim();
        const District = document.getElementById('district').value.trim();

        if (!FullName || !Email || !Password || !Role || !Phone || !District) {
            alert("Please fill all required fields!");
            return;
        }

        const data = { FullName, Email, Password, Role, Phone, District };

        console.log("Register Data:", data); 

        try {
            const res = await fetch(`${apiUrl}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            alert(result.message);

            if (res.ok) {
                window.location.href = 'login.html';
            }
        } catch (err) {
            console.error("Registration Error:", err);
            alert("Something went wrong. Try again.");
        }
    });
}

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const Email = document.getElementById('email').value.trim();
        const Password = document.getElementById('password').value.trim();

        if (!Email || !Password) {
            alert("Please enter email and password!");
            return;
        }

        const data = { Email, Password };

        try {
            const res = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (res.ok) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('role', result.role);
                if (result.role === 'farmer') window.location.href = 'farmer-dashboard.html';
                else if (result.role === 'buyer') window.location.href = 'buyer-dashboard.html';
                else window.location.href = 'admin-dashboard.html';
            } else {
                alert(result.message);
            }
        } catch (err) {
            console.error("Login Error:", err);
            alert("Something went wrong. Try again.");
        }
    });
}

