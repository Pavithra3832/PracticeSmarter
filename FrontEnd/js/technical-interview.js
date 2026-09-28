// ======================================
// FIREBASE AUTH
// ======================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


// ======================================
// FIREBASE CONFIG
// ======================================

const firebaseConfig = {
    apiKey: "AIzaSyDnR_HHjMjsUanr0ZIC1uwyEDJQ2aVxqTU",
    authDomain: "ai-interview-practice-pl-acc38.firebaseapp.com",
    projectId: "ai-interview-practice-pl-acc38",
    storageBucket: "ai-interview-practice-pl-acc38.firebasestorage.app",
    messagingSenderId: "64194969019",
    appId: "1:64194969019:web:83b2addcd10f5a9f74989e",
    measurementId: "G-PL54GCRDF6"
};

// ======================================
// INITIALIZE FIREBASE
// ======================================

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// ======================================
// LOGIN PROTECTION
// ======================================

if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.replace("login.html");
}
// ======================================
// QUESTION SETS
// ======================================

const questionSets = {

    
    HTML: [

    // ==============================
    // EASY - 10 QUESTIONS
    // ==============================

    {
        question: "What is HTML?",
        difficulty: "Easy",
        answer: "HTML stands for HyperText Markup Language. It is used to create and structure content on web pages."
    },
    {
        question: "What is an HTML tag?",
        difficulty: "Easy",
        answer: "An HTML tag is a keyword enclosed in angle brackets used to define and structure elements on a web page."
    },
    {
        question: "What is an HTML element?",
        difficulty: "Easy",
        answer: "An HTML element usually consists of an opening tag, content, and a closing tag."
    },
    {
        question: "What is the purpose of the <p> tag?",
        difficulty: "Easy",
        answer: "The <p> tag is used to define a paragraph in HTML."
    },
    {
        question: "What is the purpose of the <h1> tag?",
        difficulty: "Easy",
        answer: "The <h1> tag is used to define the main or most important heading on a web page."
    },
    {
        question: "What is the purpose of the <a> tag?",
        difficulty: "Easy",
        answer: "The <a> tag is used to create hyperlinks that allow users to navigate to another page or location."
    },
    {
        question: "What is the purpose of the <img> tag?",
        difficulty: "Easy",
        answer: "The <img> tag is used to display an image on a web page."
    },
    {
        question: "What is the purpose of the <br> tag?",
        difficulty: "Easy",
        answer: "The <br> tag is used to insert a line break in HTML."
    },
    {
        question: "What is an HTML attribute?",
        difficulty: "Easy",
        answer: "An HTML attribute provides additional information about an HTML element and is usually written inside the opening tag."
    },
    {
        question: "What is the purpose of the <title> tag?",
        difficulty: "Easy",
        answer: "The <title> tag defines the title of an HTML document that appears in the browser tab."
    },


    // ==============================
    // MEDIUM - 10 QUESTIONS
    // ==============================

    {
        question: "What is the difference between id and class in HTML?",
        difficulty: "Medium",
        answer: "An id uniquely identifies one element, while a class can be used on multiple elements."
    },
    {
        question: "What are semantic HTML elements?",
        difficulty: "Medium",
        answer: "Semantic HTML elements clearly describe their meaning and purpose, such as header, nav, main, section, article, and footer."
    },
    {
        question: "What is the purpose of the HTML form element?",
        difficulty: "Medium",
        answer: "The form element is used to collect user input and submit data to a server."
    },
    {
        question: "What is the difference between <div> and <span>?",
        difficulty: "Medium",
        answer: "The div element is a block-level container, while the span element is an inline container."
    },
    {
        question: "What is the difference between block-level and inline elements?",
        difficulty: "Medium",
        answer: "Block-level elements normally start on a new line and take available width, while inline elements occupy only the space needed by their content."
    },
    {
        question: "What is the purpose of the alt attribute in images?",
        difficulty: "Medium",
        answer: "The alt attribute provides alternative text for an image when it cannot be displayed and improves accessibility."
    },
    {
        question: "What is the difference between ordered and unordered lists?",
        difficulty: "Medium",
        answer: "An ordered list uses the <ol> element and displays items in a sequence, while an unordered list uses <ul> and displays items with bullets."
    },
    {
        question: "What is the purpose of the HTML meta tag?",
        difficulty: "Medium",
        answer: "The meta tag provides metadata about the HTML document, such as character encoding and viewport information."
    },
    {
        question: "What is the difference between HTML and HTML5?",
        difficulty: "Medium",
        answer: "HTML5 is the modern version of HTML that introduced semantic elements, multimedia elements, improved forms, and other new features."
    },
    {
        question: "Why is the DOCTYPE declaration used in HTML?",
        difficulty: "Medium",
        answer: "The DOCTYPE declaration tells the browser which HTML standard the document follows and helps the browser render the page correctly."
    },


    // ==============================
    // HARD - 10 QUESTIONS
    // ==============================

    {
        question: "What is the difference between localStorage and sessionStorage?",
        difficulty: "Hard",
        answer: "localStorage stores data without an expiration time, while sessionStorage stores data only for the duration of the browser tab session."
    },
    {
        question: "What is the difference between cookies and localStorage?",
        difficulty: "Hard",
        answer: "Cookies can be sent automatically with HTTP requests, while localStorage data remains in the browser and is not automatically sent to the server."
    },
    {
        question: "What is the purpose of the viewport meta tag?",
        difficulty: "Hard",
        answer: "The viewport meta tag controls how a web page is displayed and scaled on different screen sizes, especially mobile devices."
    },
    {
        question: "What is the difference between async and defer in script loading?",
        difficulty: "Hard",
        answer: "Both allow scripts to load without blocking HTML parsing, but async executes as soon as it finishes downloading, while defer waits until HTML parsing is complete."
    },
    {
        question: "What is the difference between GET and POST methods in HTML forms?",
        difficulty: "Hard",
        answer: "GET sends form data through the URL and is commonly used for retrieving data, while POST sends data in the request body and is commonly used for submitting data."
    },
    {
        question: "What is accessibility in HTML?",
        difficulty: "Hard",
        answer: "Accessibility means designing HTML so that people with disabilities can use and understand web content, often with semantic elements, labels, and alternative text."
    },
    {
        question: "What is the purpose of ARIA attributes?",
        difficulty: "Hard",
        answer: "ARIA attributes provide additional accessibility information to assistive technologies when native HTML semantics are not sufficient."
    },
    {
        question: "What is the difference between canvas and SVG?",
        difficulty: "Hard",
        answer: "Canvas uses JavaScript to draw graphics pixel by pixel, while SVG uses XML-based vector elements that can be scaled without losing quality."
    },
    {
        question: "What is the purpose of the iframe element?",
        difficulty: "Hard",
        answer: "The iframe element is used to embed another HTML document or external content inside the current web page."
    },
    {
        question: "What is progressive enhancement in web development?",
        difficulty: "Hard",
        answer: "Progressive enhancement is an approach where basic functionality is provided first and additional features are added for browsers or devices that support them."
    }

],
CSS: [

    // ==============================
    // EASY - 10 QUESTIONS
    // ==============================

    {
        question: "What is CSS?",
        difficulty: "Easy",
        answer: "CSS stands for Cascading Style Sheets. It is used to style and design HTML elements on web pages."
    },
    {
        question: "What is a CSS selector?",
        difficulty: "Easy",
        answer: "A CSS selector is used to select HTML elements that you want to style."
    },
    {
        question: "What is the difference between margin and padding?",
        difficulty: "Easy",
        answer: "Margin is the space outside an element's border, while padding is the space between the content and the border."
    },
    {
        question: "What is the CSS box model?",
        difficulty: "Easy",
        answer: "The CSS box model consists of content, padding, border, and margin."
    },
    {
        question: "How do you change text color in CSS?",
        difficulty: "Easy",
        answer: "The color property is used to change the text color in CSS."
    },
    {
        question: "How do you change the background color in CSS?",
        difficulty: "Easy",
        answer: "The background-color property is used to change the background color of an element."
    },
    {
        question: "What is the purpose of the font-size property?",
        difficulty: "Easy",
        answer: "The font-size property is used to control the size of text."
    },
    {
        question: "What is the purpose of the display property?",
        difficulty: "Easy",
        answer: "The display property controls how an HTML element is displayed and participates in the layout."
    },
    {
        question: "What is a class selector in CSS?",
        difficulty: "Easy",
        answer: "A class selector targets HTML elements that have a specific class attribute and starts with a dot."
    },
    {
        question: "What is an id selector in CSS?",
        difficulty: "Easy",
        answer: "An id selector targets an element with a specific id attribute and starts with a hash symbol."
    },


    // ==============================
    // MEDIUM - 10 QUESTIONS
    // ==============================

    {
        question: "What is the difference between class and id selectors in CSS?",
        difficulty: "Medium",
        answer: "A class selector can be applied to multiple elements, while an id selector is intended to identify a unique element."
    },
    {
        question: "What is Flexbox?",
        difficulty: "Medium",
        answer: "Flexbox is a CSS layout system designed to arrange elements efficiently in a one-dimensional row or column."
    },
    {
        question: "What is CSS Grid?",
        difficulty: "Medium",
        answer: "CSS Grid is a two-dimensional layout system used to arrange elements in rows and columns."
    },
    {
        question: "What is the difference between Flexbox and Grid?",
        difficulty: "Medium",
        answer: "Flexbox is mainly designed for one-dimensional layouts, while CSS Grid is designed for two-dimensional layouts."
    },
    {
        question: "What is CSS specificity?",
        difficulty: "Medium",
        answer: "CSS specificity determines which CSS rule is applied when multiple rules target the same element."
    },
    {
        question: "What is the difference between relative and absolute positioning?",
        difficulty: "Medium",
        answer: "Relative positioning moves an element relative to its normal position, while absolute positioning positions an element relative to its nearest positioned ancestor."
    },
    {
        question: "What is the difference between display none and visibility hidden?",
        difficulty: "Medium",
        answer: "display: none removes the element from the layout, while visibility: hidden hides the element but keeps its space."
    },
    {
        question: "What are pseudo-classes in CSS?",
        difficulty: "Medium",
        answer: "Pseudo-classes define special states of elements, such as :hover, :focus, and :active."
    },
    {
        question: "What are pseudo-elements in CSS?",
        difficulty: "Medium",
        answer: "Pseudo-elements allow you to style a specific part of an element, such as ::before and ::after."
    },
    {
        question: "What is the CSS position property?",
        difficulty: "Medium",
        answer: "The position property controls how an element is positioned in a document."
    },


    // ==============================
    // HARD - 10 QUESTIONS
    // ==============================

    {
        question: "What is CSS inheritance?",
        difficulty: "Hard",
        answer: "CSS inheritance allows certain properties of a parent element to be passed down to its child elements."
    },
    {
        question: "What is the difference between em and rem units?",
        difficulty: "Hard",
        answer: "em is relative to the font size of its parent or current context, while rem is relative to the root element's font size."
    },
    {
        question: "What are CSS media queries?",
        difficulty: "Hard",
        answer: "Media queries apply different CSS rules based on conditions such as screen width, height, or device characteristics."
    },
    {
        question: "What is responsive web design?",
        difficulty: "Hard",
        answer: "Responsive web design makes websites adapt to different screen sizes and devices."
    },
    {
        question: "What is z-index in CSS?",
        difficulty: "Hard",
        answer: "The z-index property controls the stacking order of positioned elements."
    },
    {
        question: "What is the difference between absolute and fixed positioning?",
        difficulty: "Hard",
        answer: "Absolute positioning is relative to a positioned ancestor, while fixed positioning is relative to the viewport and normally remains in place when scrolling."
    },
    {
        question: "What is a CSS transition?",
        difficulty: "Hard",
        answer: "A CSS transition creates a smooth change between different property values over a specified duration."
    },
    {
        question: "What is a CSS animation?",
        difficulty: "Hard",
        answer: "CSS animations allow elements to change styles through multiple keyframes over a specified period."
    },
    {
        question: "What is the difference between min-width and max-width?",
        difficulty: "Hard",
        answer: "min-width defines the minimum width an element can have, while max-width defines the maximum width."
    },
    {
        question: "What is the difference between CSS variables and normal CSS properties?",
        difficulty: "Hard",
        answer: "CSS variables store reusable custom values that can be referenced throughout a stylesheet using the var() function."
    }

],

    JavaScript: [

    // ==============================
    // EASY - 10 QUESTIONS
    // ==============================

    {
        question: "What is JavaScript?",
        difficulty: "Easy",
        answer: "JavaScript is a programming language used to make web pages interactive and dynamic."
    },
    {
        question: "What is a variable in JavaScript?",
        difficulty: "Easy",
        answer: "A variable is used to store data values that can be used and changed in a program."
    },
    {
        question: "What is a function in JavaScript?",
        difficulty: "Easy",
        answer: "A function is a reusable block of code designed to perform a specific task."
    },
    {
        question: "What is an array in JavaScript?",
        difficulty: "Easy",
        answer: "An array is a data structure used to store multiple values in a single variable."
    },
    {
        question: "What is an object in JavaScript?",
        difficulty: "Easy",
        answer: "An object is a collection of key-value pairs used to store related data."
    },
    {
        question: "What is a string in JavaScript?",
        difficulty: "Easy",
        answer: "A string is a data type used to represent text and is written inside quotes."
    },
    {
        question: "What is the typeof operator?",
        difficulty: "Easy",
        answer: "The typeof operator is used to determine the data type of a value."
    },
    {
        question: "What is an if statement?",
        difficulty: "Easy",
        answer: "An if statement executes a block of code when a specified condition is true."
    },
    {
        question: "What is a loop in JavaScript?",
        difficulty: "Easy",
        answer: "A loop repeatedly executes a block of code while a condition is satisfied."
    },
    {
        question: "What is console.log() used for?",
        difficulty: "Easy",
        answer: "console.log() is used to display information or values in the browser console."
    },


    // ==============================
    // MEDIUM - 10 QUESTIONS
    // ==============================

    {
        question: "What is the difference between let, const and var?",
        difficulty: "Medium",
        answer: "let and const are block-scoped variables. const cannot be reassigned, while let can be reassigned. var is function-scoped."
    },
    {
        question: "What is the DOM?",
        difficulty: "Medium",
        answer: "DOM stands for Document Object Model. It represents an HTML document as a tree of objects that JavaScript can access and modify."
    },
    {
        question: "What is an event in JavaScript?",
        difficulty: "Medium",
        answer: "An event is an action such as a click, key press, or mouse movement that JavaScript can respond to."
    },
    {
        question: "What is the difference between == and ===?",
        difficulty: "Medium",
        answer: "The == operator compares values after type conversion, while === compares both value and data type."
    },
    {
        question: "What is the difference between null and undefined?",
        difficulty: "Medium",
        answer: "undefined usually means a value has not been assigned, while null represents an intentional absence of a value."
    },
    {
        question: "What is an arrow function?",
        difficulty: "Medium",
        answer: "An arrow function is a shorter syntax for writing functions using the => operator."
    },
    {
        question: "What is a callback function?",
        difficulty: "Medium",
        answer: "A callback is a function passed to another function to be executed later."
    },
    {
        question: "What is event bubbling?",
        difficulty: "Medium",
        answer: "Event bubbling is a process where an event starts from the target element and propagates upward through its parent elements."
    },
    {
        question: "What is JSON?",
        difficulty: "Medium",
        answer: "JSON stands for JavaScript Object Notation. It is a lightweight format commonly used to exchange structured data."
    },
    {
        question: "What is localStorage?",
        difficulty: "Medium",
        answer: "localStorage allows web applications to store data in the browser that remains available even after the browser is closed."
    },


    // ==============================
    // HARD - 10 QUESTIONS
    // ==============================

    {
        question: "What is a closure in JavaScript?",
        difficulty: "Hard",
        answer: "A closure occurs when a function remembers and can access variables from its outer scope even after the outer function has finished executing."
    },
    {
        question: "What is hoisting in JavaScript?",
        difficulty: "Hard",
        answer: "Hoisting is JavaScript's behavior of processing declarations before executing code, which affects how variables and functions can be accessed."
    },
    {
        question: "What is the JavaScript event loop?",
        difficulty: "Hard",
        answer: "The event loop allows JavaScript to handle asynchronous operations by coordinating the call stack, task queues, and other runtime mechanisms."
    },
    {
        question: "What is a Promise in JavaScript?",
        difficulty: "Hard",
        answer: "A Promise represents the eventual completion or failure of an asynchronous operation and its resulting value."
    },
    {
        question: "What is async and await?",
        difficulty: "Hard",
        answer: "async and await provide a cleaner way to work with Promises and write asynchronous code that looks more like synchronous code."
    },
    {
        question: "What is the difference between synchronous and asynchronous JavaScript?",
        difficulty: "Hard",
        answer: "Synchronous code executes operations in order, while asynchronous code allows certain operations to continue without blocking other work."
    },
    {
        question: "What is prototypal inheritance?",
        difficulty: "Hard",
        answer: "Prototypal inheritance allows JavaScript objects to inherit properties and methods from another object through the prototype chain."
    },
    {
        question: "What is the difference between call, apply and bind?",
        difficulty: "Hard",
        answer: "call and apply invoke a function immediately with a specified this value, while bind creates a new function with a specified this value."
    },
    {
        question: "What is debouncing in JavaScript?",
        difficulty: "Hard",
        answer: "Debouncing delays the execution of a function until a specified amount of time has passed without another triggering event."
    },
    {
        question: "What is throttling in JavaScript?",
        difficulty: "Hard",
        answer: "Throttling limits how often a function can execute within a specified time period."
    }

],

    Python: [

        // ==============================
        // EASY - 10 QUESTIONS
        // ==============================

        {
            question: "What is Python?",
            difficulty: "Easy",
            answer: "Python is a high-level, interpreted programming language known for its simple syntax and readability."
        },
        {
            question: "What are variables in Python?",
            difficulty: "Easy",
            answer: "Variables are names used to store values in Python. Python does not require explicit variable type declaration."
        },
        {
            question: "What is a list in Python?",
            difficulty: "Easy",
            answer: "A list is an ordered and mutable collection used to store multiple values in Python."
        },
        {
            question: "What is a tuple in Python?",
            difficulty: "Easy",
            answer: "A tuple is an ordered and immutable collection of values in Python."
        },
        {
            question: "What is a dictionary in Python?",
            difficulty: "Easy",
            answer: "A dictionary stores data in key-value pairs and is written using curly braces."
        },
        {
            question: "What is a function in Python?",
            difficulty: "Easy",
            answer: "A function is a reusable block of code designed to perform a specific task."
        },
        {
            question: "What is indentation in Python?",
            difficulty: "Easy",
            answer: "Indentation is the whitespace used at the beginning of a line to define code blocks in Python."
        },
        {
            question: "What is the print() function used for?",
            difficulty: "Easy",
            answer: "The print() function is used to display output on the screen."
        },
        {
            question: "What is a comment in Python?",
            difficulty: "Easy",
            answer: "A comment is text ignored by Python and is commonly used to explain code. A single-line comment starts with #."
        },
        {
            question: "What is the difference between a list and a tuple?",
            difficulty: "Easy",
            answer: "A list is mutable, meaning its elements can be changed, while a tuple is immutable."
        },

    
        // ==============================
        // MEDIUM - 10 QUESTIONS
        // ==============================

        {
            question: "What is the difference between == and is in Python?",
            difficulty: "Medium",
            answer: "The == operator compares the values of objects, while the is operator checks whether two references point to the same object."
        },
        {
            question: "What is the difference between mutable and immutable objects?",
            difficulty: "Medium",
            answer: "Mutable objects can be changed after creation, while immutable objects cannot be changed after creation."
        },
        {
            question: "What are *args and **kwargs in Python?",
            difficulty: "Medium",
            answer: "*args allows a function to accept multiple positional arguments, while **kwargs allows it to accept multiple keyword arguments."
        },
        {
            question: "What is list comprehension in Python?",
            difficulty: "Medium",
            answer: "List comprehension is a concise way to create a new list by applying an expression to items in an iterable."
        },
        {
            question: "What is exception handling in Python?",
            difficulty: "Medium",
            answer: "Exception handling allows programs to handle runtime errors using try, except, else, and finally blocks."
        },
        {
            question: "What is the difference between append() and extend()?",
            difficulty: "Medium",
            answer: "append() adds one item to the end of a list, while extend() adds each item from another iterable."
        },
        {
            question: "What is a lambda function in Python?",
            difficulty: "Medium",
            answer: "A lambda function is a small anonymous function written using the lambda keyword."
        },
        {
            question: "What is a module in Python?",
            difficulty: "Medium",
            answer: "A module is a Python file containing functions, classes, or variables that can be imported and reused in another program."
        },
        {
            question: "What is the difference between local and global variables?",
            difficulty: "Medium",
            answer: "A local variable is defined inside a function and is normally accessible only there, while a global variable is defined outside functions and can be accessed more broadly."
        },
        {
            question: "What is a class in Python?",
            difficulty: "Medium",
            answer: "A class is a blueprint for creating objects and defining their attributes and methods."
        },


        // ==============================
        // HARD - 10 QUESTIONS
        // ==============================

        {
            question: "What is object-oriented programming in Python?",
            difficulty: "Hard",
            answer: "Object-oriented programming is a programming approach based on objects and classes. Python supports concepts such as inheritance, encapsulation, polymorphism, and abstraction."
        },
        {
            question: "What is inheritance in Python?",
            difficulty: "Hard",
            answer: "Inheritance allows a class to acquire attributes and methods from another class, promoting code reuse."
        },
        {
            question: "What is polymorphism in Python?",
            difficulty: "Hard",
            answer: "Polymorphism allows different objects to respond to the same method or operation in their own way."
        },
        {
            question: "What is encapsulation in Python?",
            difficulty: "Hard",
            answer: "Encapsulation is the practice of bundling data and methods together and controlling how the internal data is accessed."
        },
        {
            question: "What are decorators in Python?",
            difficulty: "Hard",
            answer: "Decorators are functions that modify or extend the behavior of another function or class without changing its original code."
        },
        {
            question: "What are generators in Python?",
            difficulty: "Hard",
            answer: "Generators are functions that produce values one at a time using the yield keyword, allowing efficient memory usage."
        },
        {
            question: "What is the difference between shallow copy and deep copy?",
            difficulty: "Hard",
            answer: "A shallow copy creates a new object but may share references to nested objects, while a deep copy recursively creates independent copies of nested objects."
        },
        {
            question: "What is the Python Global Interpreter Lock (GIL)?",
            difficulty: "Hard",
            answer: "The Global Interpreter Lock is a mechanism in the standard CPython implementation that allows only one thread to execute Python bytecode at a time."
        },
        {
            question: "What is a virtual environment in Python?",
            difficulty: "Hard",
            answer: "A virtual environment creates an isolated Python environment so that a project can use its own packages and dependencies without affecting other projects."
        },
        {
            question: "What is the difference between multiprocessing and multithreading in Python?",
            difficulty: "Hard",
            answer: "Multithreading uses multiple threads within a process, while multiprocessing uses separate processes. Multiprocessing can be useful for CPU-bound tasks in CPython because separate processes are not limited by the GIL in the same way."
        }

    ],
    Java: [

        // ==============================
        // EASY - 10 QUESTIONS
        // ==============================

        {
            question: "What is Java?",
            difficulty: "Easy",
            answer: "Java is a high-level, object-oriented programming language designed to be platform independent."
        },
        {
            question: "What are the main features of Java?",
            difficulty: "Easy",
            answer: "Major features of Java include object-oriented programming, platform independence, security, robustness, portability, and automatic memory management."
        },
        {
            question: "What is a class in Java?",
            difficulty: "Easy",
            answer: "A class is a blueprint or template used to create objects in Java."
        },
        {
            question: "What is an object in Java?",
            difficulty: "Easy",
            answer: "An object is an instance of a class that contains state and behavior."
        },
        {
            question: "What is a variable in Java?",
            difficulty: "Easy",
            answer: "A variable is a named memory location used to store a value of a specific data type."
        },
        {
            question: "What are data types in Java?",
            difficulty: "Easy",
            answer: "Java data types define the type of data a variable can store. They include primitive types such as int, float, double, char, boolean, byte, short, and long, and reference types."
        },
        {
            question: "What is a method in Java?",
            difficulty: "Easy",
            answer: "A method is a block of code inside a class that performs a specific task."
        },
        {
            question: "What is the main() method in Java?",
            difficulty: "Easy",
            answer: "The main() method is the entry point of a Java application from which program execution normally begins."
        },
        {
            question: "What is a constructor in Java?",
            difficulty: "Easy",
            answer: "A constructor is a special member of a class that is called when an object is created and is commonly used to initialize the object."
        },
        {
            question: "What is inheritance in Java?",
            difficulty: "Easy",
            answer: "Inheritance is an object-oriented feature that allows one class to acquire properties and methods from another class."
        },

        // ==============================
        // MEDIUM - 10 QUESTIONS
        // ==============================

        {
            question: "What is the difference between JDK, JRE, and JVM?",
            difficulty: "Medium",
            answer: "JVM executes Java bytecode, JRE provides the JVM and libraries needed to run Java applications, and JDK includes the JRE plus development tools such as the Java compiler."
        },
        {
            question: "What is method overloading in Java?",
            difficulty: "Medium",
            answer: "Method overloading occurs when multiple methods in the same class have the same name but different parameter lists."
        },
        {
            question: "What is method overriding in Java?",
            difficulty: "Medium",
            answer: "Method overriding occurs when a subclass provides its own implementation of an inherited method with the same signature."
        },
        {
            question: "What is the difference between overloading and overriding?",
            difficulty: "Medium",
            answer: "Overloading usually happens within the same class with different parameters, while overriding occurs when a subclass provides a new implementation of an inherited method."
        },
        {
            question: "What is encapsulation in Java?",
            difficulty: "Medium",
            answer: "Encapsulation is the practice of bundling data and methods together in a class and controlling access to the data using access modifiers."
        },
        {
            question: "What is polymorphism in Java?",
            difficulty: "Medium",
            answer: "Polymorphism allows the same interface or method call to behave differently depending on the object or implementation."
        },
        {
            question: "What is an interface in Java?",
            difficulty: "Medium",
            answer: "An interface defines a contract that implementing classes agree to follow and can contain abstract methods as well as supported concrete members."
        },
        {
            question: "What is an abstract class in Java?",
            difficulty: "Medium",
            answer: "An abstract class is a class that cannot normally be instantiated directly and can contain both abstract and concrete methods."
        },
        {
            question: "What is the difference between == and equals() in Java?",
            difficulty: "Medium",
            answer: "For objects, == compares references, while equals() is a method used to compare logical equality when the class provides an appropriate implementation."
        },
        {
            question: "What are access modifiers in Java?",
            difficulty: "Medium",
            answer: "Access modifiers control visibility of classes and members. Common modifiers include public, protected, private, and package-private access."
        },

        // ==============================
        // HARD - 10 QUESTIONS
        // ==============================

        {
            question: "What is exception handling in Java?",
            difficulty: "Hard",
            answer: "Exception handling is a mechanism for handling runtime problems using constructs such as try, catch, finally, throw, and throws."
        },
        {
            question: "What is the difference between checked and unchecked exceptions?",
            difficulty: "Hard",
            answer: "Checked exceptions are checked by the compiler and generally must be handled or declared, while unchecked exceptions are RuntimeException subclasses and are not required to be declared."
        },
        {
            question: "What is multithreading in Java?",
            difficulty: "Hard",
            answer: "Multithreading is the execution of multiple threads within a process so that different tasks can progress concurrently."
        },
        {
            question: "What is synchronization in Java?",
            difficulty: "Hard",
            answer: "Synchronization is used to control access to shared resources so that multiple threads do not cause inconsistent results."
        },
        {
            question: "What is garbage collection in Java?",
            difficulty: "Hard",
            answer: "Garbage collection automatically identifies and reclaims memory occupied by objects that are no longer reachable."
        },
        {
            question: "What is the Java Collections Framework?",
            difficulty: "Hard",
            answer: "The Java Collections Framework provides interfaces and classes such as List, Set, Map, ArrayList, HashSet, and HashMap for storing and managing groups of objects."
        },
        {
            question: "What is the difference between ArrayList and LinkedList?",
            difficulty: "Hard",
            answer: "ArrayList is backed by a dynamically sized array and generally provides fast random access, while LinkedList is based on linked nodes and can be useful for certain insertion and removal operations."
        },
        {
            question: "What is a HashMap in Java?",
            difficulty: "Hard",
            answer: "HashMap is a collection that stores key-value pairs and uses hashing to provide efficient average-time lookup, insertion, and removal."
        },
        {
            question: "What is an immutable object in Java?",
            difficulty: "Hard",
            answer: "An immutable object cannot have its state changed after it is created. String is a common example of an immutable Java class."
        },
        {
            question: "What is the difference between String, StringBuilder, and StringBuffer?",
            difficulty: "Hard",
            answer: "String is immutable, while StringBuilder and StringBuffer are mutable. StringBuilder is generally preferred for single-threaded string modification, while StringBuffer provides synchronized methods."
        }

    ]
}; 

// ======================================
// CURRENT DATA
// ======================================

const urlParams =
    new URLSearchParams(window.location.search);

// ======================================
// UNIQUE INTERVIEW SESSION ID
// ======================================

const interviewSessionId =
    `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

sessionStorage.setItem(
    "interviewSessionId",
    interviewSessionId
);

// ======================================
// SELECTED CATEGORY
// ======================================

const urlCategory =
    urlParams.get("category") ||
    urlParams.get("topic");

let selectedCategory =
    urlCategory ||
    localStorage.getItem("interviewCategory") ||
    "HTML";

// ======================================
// SELECTED DIFFICULTY
// ======================================

let selectedDifficulty =
    urlParams.get("difficulty") ||
    localStorage.getItem("interviewDifficulty") ||
    "Easy";

    const hasDifficultyFromURL =
    urlParams.has("difficulty");

if (
    !["Easy", "Medium", "Hard"].includes(
        selectedDifficulty
    )
) {
    selectedDifficulty = "Easy";
}

// Save current selections

localStorage.setItem(
    "interviewCategory",
    selectedCategory
);

localStorage.setItem(
    "interviewDifficulty",
    selectedDifficulty
);

// ======================================
// AI INTERVIEW STATE
// ======================================

let aiMode = false;

let aiQuestions = [];

// ======================================
// QUESTIONS
// ======================================

// Load questions for the selected technology
// and selected difficulty only.

let questions;

if (hasDifficultyFromURL) {

    // Practice Again / direct difficulty mode
    // Show only selected difficulty = 10 questions

    questions =
        (questionSets[selectedCategory] || []).filter(
            question =>
                question.difficulty === selectedDifficulty
        );

} else {

    // Fresh technology selection
    // Show all 30 questions

    questions =
        questionSets[selectedCategory] || [];
}

// Safety check

if (questions.length === 0) {
    console.error(
        `No questions available for ${selectedCategory}.`
    );

    questions =
        questionSets[selectedCategory] || [];
}
// Current question number

let currentQuestion = 0;

// User answers

let answers =
    new Array(questions.length).fill("");
// ======================================
// GET ELEMENTS
// ======================================

const questionText =
    document.getElementById("question-text");

const questionNumber =
    document.getElementById("question-number");

const nextButton =
    document.getElementById("next-button");

const previousButton =
    document.getElementById("previous-button");

const submitButton =
    document.getElementById("submit-button");

const timer =
    document.getElementById("timer");

const answerBox =
    document.getElementById("answer");

const technologyButtons =
    document.querySelectorAll(".technology-button");

const difficultyButtons =
    document.querySelectorAll(".difficulty-button");    

const progressFill =
    document.getElementById("progress-fill");

const progressPercentage =
    document.getElementById("progress-percentage");

const showAnswerButton =
    document.getElementById("show-answer-button");

const modelAnswer =
    document.getElementById("model-answer");

const answerText =
    document.getElementById("answer-text");

const cameraButton =
    document.querySelector(".camera-answer-button");

const cameraBox =
    document.querySelector(".camera-box");


// ======================================
// TIMER
// ======================================

let timeLeft = 60;
let countdown = null;
// ======================================
// UPDATE TIMER
// ======================================

function updateTimer() {

    const minutes =
        Math.floor(timeLeft / 60);

    const seconds =
        timeLeft % 60;

    timer.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;


    // ==================================
    // TIME FINISHED
    // ==================================

    if (timeLeft <= 0) {

        // Save current answer
        answers[currentQuestion] =
            answerBox.value;


        // ==================================
        // AI MODE
        // ==================================

        if (aiMode) {

            // Q30 completed
            if (currentQuestion >= questions.length - 1){
                submitButton.click();

                return;

            }

            // Move to next AI question
            currentQuestion++;

            showQuestion();

            startTimer();

            return;

        }


        // ==================================
        // NORMAL MODE
        // ==================================

        if (
            currentQuestion ===
            questions.length - 1
        ) {

            clearInterval(countdown);

            saveAnswers();

            window.location.href =
                "result.html";

            return;

        }


        currentQuestion++;

        showQuestion();

        startTimer();

        return;

    }

    timeLeft--;

}


// ======================================
// START TIMER
// ======================================

function startTimer() {

    clearInterval(countdown);

    timeLeft = 60;

    updateTimer();

    countdown =
        setInterval(updateTimer, 1000);

}


// ======================================
// SAVE ANSWERS
// ======================================

function saveAnswers() {

    localStorage.setItem(
        "interviewAnswers",
        JSON.stringify(answers)
    );

    localStorage.setItem(
        "interviewQuestions",
        JSON.stringify(questions)
    );

    localStorage.setItem(
        "interviewCategory",
        selectedCategory
    );

    localStorage.setItem(
        "interviewDifficulty",
        selectedDifficulty
    );

}


// ======================================
// SHOW QUESTION
// ======================================

function showQuestion() {

    const current =
        questions[currentQuestion];


    // Safety check
    if (!current) {
        return;
    }


    // ==================================
    // QUESTION
    // ==================================

    questionText.textContent =
        current.question;


    questionNumber.textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;


    // ==================================
    // USER ANSWER
    // ==================================

    answerBox.value =
        answers[currentQuestion] || "";


    // ==================================
    // MODEL ANSWER
    // ==================================

    modelAnswer.classList.remove("show");

    answerText.textContent =
        current.answer ||
        "Model answer is not available.";

    showAnswerButton.style.display = "";

    showAnswerButton.textContent =
        "💡 Show Answer";


    // ==================================
    // PROGRESS
    // ==================================

    const progress =
        ((currentQuestion + 1) /
        questions.length) * 100;

    progressFill.style.width =
        progress + "%";

    progressPercentage.textContent =
        Math.round(progress) + "%";


    // ==================================
    // PREVIOUS
    // ==================================

    previousButton.disabled =
        currentQuestion === 0;


    // ==================================
    // NEXT / SUBMIT
    // ==================================

    if (
        currentQuestion ===
        questions.length - 1
    ) {

        nextButton.style.display =
            "none";

        submitButton.style.display =
            "block";

    } else {

        nextButton.style.display =
            "block";

        submitButton.style.display =
            "none";

    }

}


// ======================================
// TECHNOLOGY BUTTONS
// ======================================

technologyButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            // Do not change technology
            // during an AI interview
            if (aiMode) {

                alert(
                    "Please finish the AI interview before changing technology."
                );

                return;
            }

            selectedCategory =
                button.dataset.category;

            // Remove active class
            technologyButtons.forEach(
                function(btn) {

                    btn.classList.remove(
                        "active"
                    );

                }
            );

            // Add active class
            button.classList.add("active");

            // ==================================
            // LOAD SELECTED TECHNOLOGY +
            // SELECTED DIFFICULTY
            // ==================================

            questions =
    questionSets[selectedCategory] || [];

            // Safety check

            if (questions.length === 0) {

                alert(
                    `No ${selectedDifficulty} questions available for ${selectedCategory}.`
                );

                return;
            }

            // Reset question number

            currentQuestion = 0;

            // Reset answers

            answers =
                new Array(
                    questions.length
                ).fill("");

            // Save selected technology

            localStorage.setItem(
                "interviewCategory",
                selectedCategory
            );

            // Save selected difficulty

            localStorage.setItem(
                "interviewDifficulty",
                selectedDifficulty
            );

            // Show first question

            showQuestion();

            // Restart timer

            startTimer();

        }
    );

});

// ======================================
// MICROPHONE / VOICE INPUT
// ======================================

const microphoneButton =
    document.querySelector(
        ".microphone-answer-button"
    );


if (microphoneButton) {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        microphoneButton.addEventListener(
            "click",
            function() {

                alert(
                    "Voice input is not supported in this browser. Please use Google Chrome."
                );

            }
        );

    } else {

        const recognition =
            new SpeechRecognition();


        recognition.lang =
            "en-US";

        recognition.continuous =
            false;

        recognition.interimResults =
            false;


        let isListening = false;


        // ==================================
        // MICROPHONE CLICK
        // ==================================

        microphoneButton.addEventListener(
            "click",
            function() {

                if (isListening) {
                    return;
                }

                try {

                    recognition.start();

                } catch (error) {

                    console.log(
                        "Microphone start error:",
                        error
                    );

                }

            }
        );


        // ==================================
        // START LISTENING
        // ==================================

        recognition.onstart =
            function() {

                isListening = true;

                microphoneButton
                    .querySelector("span")
                    .textContent =
                    "Status: Listening... 🎤";

            };


        // ==================================
        // SPEECH RESULT
        // ==================================

        recognition.onresult =
            function(event) {

                const transcript =
                    event.results[0][0]
                        .transcript;

                answerBox.value +=
                    (
                        answerBox.value
                            ? " "
                            : ""
                    ) + transcript;

            };


        // ==================================
        // ERROR
        // ==================================

        recognition.onerror =
            function(event) {

                console.log(
                    "Speech recognition error:",
                    event.error
                );

                isListening = false;

                microphoneButton
                    .querySelector("span")
                    .textContent =
                    "Status: Click to speak";


                if (
                    event.error ===
                    "not-allowed"
                ) {

                    alert(
                        "Microphone permission is blocked. Please allow microphone access in Chrome."
                    );

                } else if (
                    event.error ===
                    "no-speech"
                ) {

                    alert(
                        "No speech detected. Please try speaking again."
                    );

                } else if (
                    event.error ===
                    "audio-capture"
                ) {

                    alert(
                        "Microphone could not be detected. Please check your microphone."
                    );

                }

            };


        // ==================================
        // END
        // ==================================

        recognition.onend =
            function() {

                isListening = false;

                microphoneButton
                    .querySelector("span")
                    .textContent =
                    "Status: Click to speak";

            };

    }

}


// ======================================
// PREVIOUS BUTTON
// ======================================

previousButton.addEventListener(
    "click",
    function() {

        // Save current answer
        answers[currentQuestion] =
            answerBox.value;


        if (currentQuestion > 0) {

            currentQuestion--;

            showQuestion();

            startTimer();

        }

    }
);


// ======================================
// NEXT BUTTON
// ======================================

nextButton.addEventListener(
    "click",
    function() {

        // Save current answer
        answers[currentQuestion] =
            answerBox.value;


        // ==================================
        // AI MODE
        // ==================================

        if (aiMode) {

    if (
        currentQuestion >=
        questions.length - 1
    ) {

        submitButton.click();

        return;

    }

    currentQuestion++;

    showQuestion();

    startTimer();

    return;

}

        // ==================================
        // NORMAL MODE
        // ==================================

        if (
            currentQuestion <
            questions.length - 1
        ) {

            currentQuestion++;

            showQuestion();

            startTimer();

        }

    }
);


// ======================================
// ENTER → NEXT / SUBMIT
// ======================================

answerBox.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();


            // Save answer
            answers[currentQuestion] =
                answerBox.value;


            // ==================================
            // AI MODE
            // ==================================

            if (aiMode) {

    if (
        currentQuestion >=
        questions.length - 1
    ) {

        submitButton.click();

        return;

    }

    currentQuestion++;

    showQuestion();

    startTimer();

    return;

}

            // ==================================
            // NORMAL MODE
            // ==================================

            if (
                currentQuestion ===
                questions.length - 1
            ) {

                submitButton.click();

            } else {

                currentQuestion++;

                showQuestion();

                startTimer();

            }

        }

    }
);


// ======================================
// SUBMIT
// ======================================

submitButton.addEventListener(
    "click",
    function() {

        answers[currentQuestion] =
            answerBox.value;


        saveAnswers();


        clearInterval(countdown);


        console.log(
            "Interview submitted successfully"
        );


        window.location.href =
            "result.html";

    }
);


// ======================================
// SHOW / HIDE MODEL ANSWER
// ======================================

showAnswerButton.addEventListener(
    "click",
    function() {

        modelAnswer.classList.toggle(
            "show"
        );


        if (
            modelAnswer.classList.contains(
                "show"
            )
        ) {

            showAnswerButton.textContent =
                "🙈 Hide Answer";

        } else {

            showAnswerButton.textContent =
                "💡 Show Answer";

        }

    }
);


// ======================================
// DIFFICULTY BUTTONS
// ======================================

difficultyButtons.forEach(button => {

    button.addEventListener("click", () => {

        const difficulty = button.dataset.difficulty;

        // ===============================
        // AI MODE
        // ===============================

        if (aiMode) {

            selectedDifficulty = difficulty;

            localStorage.setItem(
                "interviewDifficulty",
                selectedDifficulty
            );

            // Active button
            difficultyButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            // Filter AI questions
            questions = aiQuestions.filter(
                q => q.difficulty === selectedDifficulty
            );

            // Safety check
            if (questions.length === 0) {
                alert(
                    `No ${selectedDifficulty} AI questions available.`
                );
                return;
            }

            // Restart selected difficulty section
            currentQuestion = 0;

            answers = new Array(
                questions.length
            ).fill("");

            clearInterval(countdown);


            showQuestion();
            startTimer();

            console.log(
                `AI ${selectedDifficulty} Interview:`,
                questions.length,
                "questions"
            );

            return;
        }


        // ===============================
        // NORMAL MODE
        // ===============================

        selectedDifficulty = difficulty;

        localStorage.setItem(
            "interviewDifficulty",
            selectedDifficulty
        );

        // Active button
        difficultyButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        // Filter normal questions
        questions =
            questionSets[selectedCategory].filter(
                q =>
                    q.difficulty === selectedDifficulty
            );

        currentQuestion = 0;

        answers = new Array(
            questions.length
        ).fill("");

        showQuestion();
        startTimer();

        console.log(
            `Normal ${selectedDifficulty} Interview:`,
            questions.length,
            "questions"
        );
    });

});


                
// ======================================
// CAMERA
// ======================================

let cameraStream = null;
let cameraVideo = null;


const cameraToggleButton =
    document.getElementById(
        "camera-toggle-button"
    );


let cameraStatus =
    document.getElementById(
        "camera-status"
    );


// ======================================
// START CAMERA
// ======================================

async function startCamera() {

    try {

        cameraStream =
            await navigator.mediaDevices
                .getUserMedia({
                    video: true,
                    audio: false
                });


        cameraBox.innerHTML = "";


        cameraVideo =
            document.createElement(
                "video"
            );


        cameraVideo.srcObject =
            cameraStream;

        cameraVideo.autoplay = true;
        cameraVideo.playsInline = true;


        cameraVideo.style.width =
            "100%";

        cameraVideo.style.height =
            "100%";

        cameraVideo.style.objectFit =
            "cover";

        cameraVideo.style.borderRadius =
            "9px";


        cameraBox.appendChild(
            cameraVideo
        );


        cameraToggleButton.textContent =
            "Turn Off Camera";


        const statusElement =
            document.getElementById(
                "camera-status"
            );


        if (statusElement) {

            statusElement.textContent =
                "Camera is on";

        }

    } catch (error) {

        console.error(
            "Camera Error:",
            error
        );


        alert(
            "Camera permission denied or camera is not available."
        );

    }

}


// ======================================
// STOP CAMERA
// ======================================

function stopCamera() {

    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(
                function(track) {

                    track.stop();

                }
            );

        cameraStream = null;

    }


    cameraBox.innerHTML = `
        <div class="camera-icon">
            📷
        </div>

        <span>
            Camera Preview
        </span>

        <small id="camera-status">
            Camera is off
        </small>
    `;


    cameraToggleButton.textContent =
        "Turn On Camera";

}


// ======================================
// CAMERA TOGGLE
// ======================================

if (cameraToggleButton) {

    cameraToggleButton.addEventListener(
        "click",
        function() {

            if (cameraStream) {

                stopCamera();

            } else {

                startCamera();

            }

        }
    );

}


// ======================================
// CAMERA ANSWER BUTTON
// ======================================

if (cameraButton) {

    cameraButton.addEventListener(
        "click",
        function() {

            if (cameraStream) {

                stopCamera();

            } else {

                startCamera();

            }

        }
    );

}


// ======================================
// PROFILE + NOTIFICATION DROPDOWN
// ======================================

const profileButton =
    document.getElementById(
        "profile-button"
    );

const profileDropdown =
    document.getElementById(
        "profile-dropdown"
    );

const notificationButton =
    document.getElementById(
        "notification-button"
    );

const notificationDropdown =
    document.getElementById(
        "notification-dropdown"
    );


// ======================================
// PROFILE BUTTON
// ======================================

if (
    profileButton &&
    profileDropdown
) {

    profileButton.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();


            if (notificationDropdown) {

                notificationDropdown
                    .classList
                    .remove("show");

            }


            profileDropdown
                .classList
                .toggle("show");

        }
    );

}


// ======================================
// NOTIFICATION BUTTON
// ======================================

if (
    notificationButton &&
    notificationDropdown
) {

    notificationButton.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();


            if (profileDropdown) {

                profileDropdown
                    .classList
                    .remove("show");

            }


            notificationDropdown
                .classList
                .toggle("show");

        }
    );

}


// ======================================
// CLICK INSIDE PROFILE
// ======================================

if (profileDropdown) {

    profileDropdown.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

        }
    );

}


// ======================================
// CLICK INSIDE NOTIFICATION
// ======================================

if (notificationDropdown) {

    notificationDropdown.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

        }
    );

}


// ======================================
// CLICK OUTSIDE
// ======================================

document.addEventListener(
    "click",
    function() {

        if (profileDropdown) {

            profileDropdown
                .classList
                .remove("show");

        }


        if (notificationDropdown) {

            notificationDropdown
                .classList
                .remove("show");

        }

    }
);


// ======================================
// LOGOUT
// ======================================

const logoutButton =
    document.getElementById(
        "logout-button"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async function() {

            try {

                await signOut(auth);


                localStorage.removeItem(
                    "isLoggedIn"
                );


                sessionStorage.clear();


                window.location.replace(
                    "login.html"
                );

            } catch (error) {

                console.error(
                    "Logout Error:",
                    error
                );


                alert(
                    "Logout failed. Please try again."
                );

            }

        }
    );

}

// ======================================
// GEMINI AI
// ======================================

const aiQuestionButton =
    document.getElementById(
        "ai-question-button"
    );

// ======================================
// GENERATE 30 AI QUESTIONS
// ======================================

async function generateAIQuestions() {

    if (!aiQuestionButton) {
        return false;
    }

    aiQuestionButton.disabled = true;

    aiQuestionButton.textContent =
        "🤖 Generating 30 Questions...";

    console.log(
        "Sending AI request:",
        selectedCategory
    );

    try {

        // ==================================
        // SEND REQUEST TO BACKEND
        // ==================================

        const response =
            await fetch(
                "http://localhost:5000/api/generate-question",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        topic: selectedCategory
                    })
                }
            );


        // ==================================
        // READ RESPONSE
        // ==================================

        const data =
            await response.json();


        // ==================================
        // CHECK ERROR
        // ==================================

        if (!response.ok) {

            throw new Error(
                data.error ||
                "Failed to generate AI questions"
            );

        }


        // ==================================
        // VALIDATE AI QUESTIONS
        // ==================================

        if (
            !data.questions ||
            !Array.isArray(data.questions) ||
            data.questions.length !== 30
        ) {

            throw new Error(
                "AI did not return exactly 30 questions"
            );

        }


        // ==================================
        // SAVE AI QUESTIONS
        // ==================================

        aiQuestions =
            data.questions.map(
                function(item) {

                    return {

                        question:
                            item.question,

                        difficulty:
                            item.difficulty,

                        answer:
                            item.answer,

                        isAI: true

                    };

                }
            );


        // ==================================
        // ENABLE AI MODE
        // ==================================

        aiMode = true;


        // ==================================
        // FILTER BY SELECTED DIFFICULTY
        // ==================================

        questions =
            aiQuestions.filter(
                function(question) {

                    return (
                        question.difficulty ===
                        selectedDifficulty
                    );

                }
            );


        // ==================================
        // SAFETY CHECK
        // ==================================

        if (questions.length === 0) {

            alert(
                `No ${selectedDifficulty} AI questions available.`
            );

            aiMode = false;

            return false;

        }


        // ==================================
        // RESET ANSWERS
        // ==================================

        answers =
            new Array(
                questions.length
            ).fill("");

        currentQuestion = 0;


        // ==================================
        // SAVE TO LOCAL STORAGE
        // ==================================

        localStorage.setItem(
            "interviewQuestions",
            JSON.stringify(questions)
        );

        localStorage.setItem(
            "interviewAnswers",
            JSON.stringify(answers)
        );

        localStorage.setItem(
            "interviewCategory",
            selectedCategory
        );

        localStorage.setItem(
            "interviewDifficulty",
            selectedDifficulty
        );


        // ==================================
        // UPDATE ACTIVE DIFFICULTY BUTTON
        // ==================================

        difficultyButtons.forEach(
            function(button) {

                button.classList.remove(
                    "active"
                );

                if (
                    button.dataset.difficulty ===
                    selectedDifficulty
                ) {

                    button.classList.add(
                        "active"
                    );

                }

            }
        );


        // ==================================
        // START AI INTERVIEW
        // ==================================

        showQuestion();

        startTimer();


        console.log(
            "AI Interview Ready:",
            questions.length,
            "questions"
        );

        console.log(
            "Selected Difficulty:",
            selectedDifficulty
        );

        console.log(
            "Total AI Questions Generated:",
            aiQuestions.length
        );

        console.log(
            "Easy:",
            aiQuestions.filter(
                q =>
                    q.difficulty === "Easy"
            ).length
        );

        console.log(
            "Medium:",
            aiQuestions.filter(
                q =>
                    q.difficulty === "Medium"
            ).length
        );

        console.log(
            "Hard:",
            aiQuestions.filter(
                q =>
                    q.difficulty === "Hard"
            ).length
        );


        return true;


    } catch (error) {

        // ==================================
        // GEMINI FAILED
        // ==================================

        console.error(
            "Gemini Question Error:",
            error
        );

        console.log(
            "Gemini unavailable. Using fallback questions."
        );


        // ==================================
        // FALLBACK QUESTIONS
        // ==================================

        const fallbackQuestions =
            questionSets[selectedCategory];


        if (
            !fallbackQuestions ||
            !Array.isArray(fallbackQuestions) ||
            fallbackQuestions.length !== 30
        ) {

            alert(
                "Technical questions are unavailable. Please try again."
            );

            return false;

        }


        // ==================================
        // USE PREDEFINED QUESTIONS
        // ==================================

        aiQuestions =
            fallbackQuestions.map(
                function(item) {

                    return {

                        question:
                            item.question,

                        difficulty:
                            item.difficulty,

                        answer:
                            item.answer,

                        isAI: false,

                        isFallback: true

                    };

                }
            );


        // ==================================
        // ENABLE AI INTERVIEW MODE
        // ==================================

        aiMode = true;


        // ==================================
        // FILTER FALLBACK BY DIFFICULTY
        // ==================================

        questions =
            aiQuestions.filter(
                function(question) {

                    return (
                        question.difficulty ===
                        selectedDifficulty
                    );

                }
            );


        // ==================================
        // SAFETY CHECK
        // ==================================

        if (questions.length === 0) {

            alert(
                `No ${selectedDifficulty} questions available.`
            );

            aiMode = false;

            return false;

        }


        // ==================================
        // RESET ANSWERS
        // ==================================

        answers =
            new Array(
                questions.length
            ).fill("");

        currentQuestion = 0;


        // ==================================
        // SAVE FALLBACK QUESTIONS
        // ==================================

        localStorage.setItem(
            "interviewQuestions",
            JSON.stringify(questions)
        );

        localStorage.setItem(
            "interviewAnswers",
            JSON.stringify(answers)
        );

        localStorage.setItem(
            "interviewCategory",
            selectedCategory
        );

        localStorage.setItem(
            "interviewDifficulty",
            selectedDifficulty
        );


        // ==================================
        // ACTIVE DIFFICULTY BUTTON
        // ==================================

        difficultyButtons.forEach(
            function(button) {

                button.classList.remove(
                    "active"
                );

                if (
                    button.dataset.difficulty ===
                    selectedDifficulty
                ) {

                    button.classList.add(
                        "active"
                    );

                }

            }
        );


        // ==================================
        // FRIENDLY MESSAGE
        // ==================================

        alert(
            "⚠️ AI service is temporarily unavailable.\n\nContinuing with technical practice questions."
        );


        // ==================================
        // START FALLBACK INTERVIEW
        // ==================================

        showQuestion();

        startTimer();


        console.log(
            "Fallback Interview Ready:",
            questions.length,
            "questions"
        );

        console.log(
            "Selected Difficulty:",
            selectedDifficulty
        );


        return true;


    } finally {

        aiQuestionButton.disabled = false;

        aiQuestionButton.textContent =
            "🤖 Generate AI Question";

    }

}

// ======================================
// AI BUTTON CLICK
// ======================================

if (aiQuestionButton) {

    aiQuestionButton.addEventListener(
        "click",
        async function() {

            await generateAIQuestions();

        }
    );

}


// ======================================
// START
// ======================================

// Selected technology active
technologyButtons.forEach(
    function(button) {

        if (
            button.dataset.category ===
            selectedCategory
        ) {

            button.classList.add(
                "active"
            );

        }

    }
);


// Selected difficulty active
difficultyButtons.forEach(
    function(button) {

        if (
            button.dataset.difficulty ===
            selectedDifficulty
        ) {

            button.classList.add(
                "active"
            );

        }

    }
);


// Show first normal question
showQuestion();

// Start normal timer
startTimer();