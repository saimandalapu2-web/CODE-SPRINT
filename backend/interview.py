# Comprehensive Interview Questions Dataset (100+ Questions)
from typing import List, Dict, Any

INTERVIEW_QUESTIONS_DATA: List[Dict[str, Any]] = [
    # --- PYTHON INTERVIEW QUESTIONS ---
    {
        "id": "int-py-01",
        "category": "Python",
        "language": "Python",
        "difficulty": "Easy",
        "question": "What is the difference between mutable and immutable types in Python?",
        "answer": "Mutable objects can be modified in place after creation without changing their memory address, while immutable objects cannot be altered once instantiated.",
        "explanation": "Examples of mutable types include `list`, `dict`, and `set`. Examples of immutable types include `int`, `float`, `str`, `tuple`, and `frozenset`. When you attempt to change an immutable object (e.g. concatenating a string), Python allocates a new object in memory.",
        "key_points": [
            "Mutable: lists, dicts, sets (in-place modification)",
            "Immutable: numbers, strings, tuples (creates new object)",
            "Dictionary keys must be immutable (hashable)"
        ],
        "company_tags": ["Google", "Meta", "Amazon"]
    },
    {
        "id": "int-py-02",
        "category": "Python",
        "language": "Python",
        "difficulty": "Medium",
        "question": "Explain the Global Interpreter Lock (GIL) and its implications on concurrency.",
        "answer": "The Global Interpreter Lock (GIL) is a mutex in CPython that prevents multiple native threads from executing Python bytecodes simultaneously within a single process.",
        "explanation": "The GIL simplifies memory management by making CPython's reference counting thread-safe. However, it restricts CPU-bound multi-threaded programs to a single CPU core. For CPU-bound tasks, developers use the `multiprocessing` module or `ProcessPoolExecutor` to spawn separate processes with independent GILs.",
        "key_points": [
            "Protects CPython memory management and reference counting",
            "Multi-threading is effective for I/O-bound operations",
            "Multiprocessing is required for true parallel CPU computing"
        ],
        "company_tags": ["Netflix", "Uber", "Microsoft"]
    },
    {
        "id": "int-py-03",
        "category": "Python",
        "language": "Python",
        "difficulty": "Medium",
        "question": "What are Python decorators and how do they work?",
        "answer": "A decorator is a callable higher-order function that takes another function as input, extends its behavior without modifying its source code, and returns the modified function.",
        "explanation": "The `@decorator_name` syntax is syntactic sugar for `func = decorator_name(func)`. Decorators leverage closures. Common use cases include authentication, logging, caching (e.g. `@functools.lru_cache`), and rate limiting.",
        "key_points": [
            "First-class function support and closures",
            "Preserve metadata with @functools.wraps",
            "Applied at definition time from bottom to top"
        ],
        "company_tags": ["Stripe", "Airbnb", "Spotify"]
    },
    {
        "id": "int-py-04",
        "category": "Python",
        "language": "Python",
        "difficulty": "Easy",
        "question": "What is the difference between `is` and `==` in Python?",
        "answer": "`==` checks for equality of value, whereas `is` checks for reference identity (whether both variables point to the exact same object in memory).",
        "explanation": "For example, `a = [1, 2, 3]` and `b = [1, 2, 3]` will evaluate `a == b` to True because their contents match, but `a is b` to False because they are distinct list instances in heap memory.",
        "key_points": [
            "== compares values via __eq__",
            "is compares object memory addresses (id(a) == id(b))",
            "Always use 'is' when checking against None"
        ],
        "company_tags": ["Apple", "Amazon"]
    },
    {
        "id": "int-py-05",
        "category": "Python",
        "language": "Python",
        "difficulty": "Medium",
        "question": "What is the difference between a generator and a standard function?",
        "answer": "A standard function executes completely and returns a single value with `return`, while a generator uses `yield` to pause execution and stream values lazily one at a time.",
        "explanation": "Generators maintain their local stack frame state across yields and adhere to the iterator protocol (`__iter__` and `__next__`). They provide O(1) memory complexity when streaming large datasets or infinite sequences.",
        "key_points": [
            "yield pauses function state; return terminates",
            "Memory efficiency via lazy evaluation",
            "Consumes items using next() until StopIteration"
        ],
        "company_tags": ["Bloomberg", "Google"]
    },

    # --- DATA STRUCTURES & ALGORITHMS ---
    {
        "id": "int-dsa-01",
        "category": "Data Structures",
        "language": None,
        "difficulty": "Easy",
        "question": "What is the difference between an Array and a Linked List?",
        "answer": "An array stores elements in contiguous memory locations providing O(1) random access by index, while a linked list stores nodes scattered in memory connected via pointers with O(1) insertions/deletions at known nodes.",
        "explanation": "Arrays suffer from expensive O(n) middle insertions/deletions and fixed capacity (or resize overhead). Linked lists require extra memory per node for pointers and have O(n) sequential lookup time with poor CPU cache locality.",
        "key_points": [
            "Array: Contiguous memory, O(1) random indexing, O(n) insertion/deletion",
            "Linked List: Pointer-linked nodes, O(n) lookup, O(1) head insertion",
            "Arrays have superior CPU cache spatial locality"
        ],
        "company_tags": ["Amazon", "Microsoft", "Meta", "Google"]
    },
    {
        "id": "int-dsa-02",
        "category": "Algorithms",
        "language": None,
        "difficulty": "Medium",
        "question": "How does Binary Search work and what is its time complexity?",
        "answer": "Binary search is a divide-and-conquer algorithm that finds a target in a sorted array by repeatedly comparing the target to the middle element and halving the search range in O(log n) time.",
        "explanation": "At each step, if `arr[mid] == target`, the element is found. If `target < arr[mid]`, the right half is discarded; otherwise the left half is discarded. Because the search space halves every iteration, time complexity is logarithmic O(log n).",
        "key_points": [
            "Requires a sorted array / monotonic sequence",
            "Time Complexity: O(log n), Space Complexity: O(1) iterative",
            "Avoid integer overflow when calculating mid: mid = left + (right - left) // 2"
        ],
        "company_tags": ["Google", "Meta", "Apple", "Uber"]
    },
    {
        "id": "int-dsa-03",
        "category": "Data Structures",
        "language": None,
        "difficulty": "Medium",
        "question": "Explain how a Hash Table handles hash collisions.",
        "answer": "A hash table handles collisions primarily using two techniques: Chaining (Separate Chaining) or Open Addressing (Linear/Quadratic Probing, Double Hashing).",
        "explanation": "In Separate Chaining, each bucket contains a linked list or balanced tree (e.g. Red-Black tree in Java HashMap) of entries that hashed to the same bucket. In Open Addressing, collisions are placed in alternate vacant buckets determined by probing sequences.",
        "key_points": [
            "Chaining: Buckets store linked lists/trees; gracefully handles high load factors",
            "Open Addressing: Stores elements directly in table array via probing",
            "Average lookup: O(1); Worst-case collision degradation: O(n)"
        ],
        "company_tags": ["Amazon", "LinkedIn", "Oracle"]
    },
    {
        "id": "int-dsa-04",
        "category": "Algorithms",
        "language": None,
        "difficulty": "Medium",
        "question": "What is the difference between Depth-First Search (DFS) and Breadth-First Search (BFS)?",
        "answer": "DFS explores as deep as possible along each branch before backtracking using a Stack (or recursion), while BFS explores all neighbor nodes at the present depth level before moving deeper using a Queue.",
        "explanation": "BFS guarantees finding the shortest path in unweighted graphs. DFS is ideal for topological sorting, detecting cycles, and backtracking problems (such as solving mazes or Sudoku). Both run in O(V + E) time.",
        "key_points": [
            "BFS uses FIFO Queue; finds shortest path in unweighted graphs",
            "DFS uses LIFO Stack/Recursion; ideal for cycle detection and topological sorting",
            "Time complexity for both: O(V + E)"
        ],
        "company_tags": ["Meta", "Google", "Microsoft", "ByteDance"]
    },
    {
        "id": "int-dsa-05",
        "category": "Algorithms",
        "language": None,
        "difficulty": "Hard",
        "question": "Explain Dynamic Programming and the difference between Memoization and Tabulation.",
        "answer": "Dynamic Programming (DP) solves complex problems by breaking them into overlapping subproblems and optimal substructures. Memoization is Top-Down caching, while Tabulation is Bottom-Up iterative table filling.",
        "explanation": "In Top-Down Memoization, you write recursive logic and store computed results in a hash table or array to prevent redundant calculation. In Bottom-Up Tabulation, you solve the base cases first and iteratively fill an array or matrix up to the target state.",
        "key_points": [
            "Requires Overlapping Subproblems + Optimal Substructure",
            "Top-Down: Recursion + Cache (Memoization)",
            "Bottom-Up: Iteration + DP Table (Tabulation, eliminates call stack overhead)"
        ],
        "company_tags": ["Google", "Amazon", "Goldman Sachs"]
    },

    # --- OBJECT-ORIENTED PROGRAMMING (OOP) ---
    {
        "id": "int-oop-01",
        "category": "OOP",
        "language": None,
        "difficulty": "Easy",
        "question": "What are the four core pillars of Object-Oriented Programming?",
        "answer": "The four pillars are Encapsulation, Abstraction, Inheritance, and Polymorphism.",
        "explanation": "Encapsulation bundles data and methods while hiding internal state. Abstraction exposes high-level interfaces while hiding implementation complexity. Inheritance allows subclasses to reuse and extend code from parent classes. Polymorphism enables entities to take on multiple forms through method overriding or overloading.",
        "key_points": [
            "Encapsulation: Data hiding and bundling",
            "Abstraction: Exposing what an object does, not how",
            "Inheritance: Code reuse and hierarchical modeling",
            "Polymorphism: Common interface for differing underlying implementations"
        ],
        "company_tags": ["Adobe", "Microsoft", "Salesforce"]
    },
    {
        "id": "int-oop-02",
        "category": "OOP",
        "language": None,
        "difficulty": "Medium",
        "question": "What are the SOLID principles in software engineering?",
        "answer": "SOLID is an acronym for five object-oriented design principles: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.",
        "explanation": "Single Responsibility: A class should have only one reason to change. Open/Closed: Software entities should be open for extension, but closed for modification. Liskov Substitution: Subtypes must be substitutable for base types. Interface Segregation: Clients should not depend on interfaces they do not use. Dependency Inversion: Depend on abstractions, not concretions.",
        "key_points": [
            "S: Single Responsibility Principle",
            "O: Open/Closed Principle",
            "L: Liskov Substitution Principle",
            "I: Interface Segregation Principle",
            "D: Dependency Inversion Principle"
        ],
        "company_tags": ["Spotify", "Amazon", "VMware"]
    },

    # --- DATABASE MANAGEMENT SYSTEMS (DBMS) & SQL ---
    {
        "id": "int-db-01",
        "category": "DBMS",
        "language": "SQL",
        "difficulty": "Easy",
        "question": "What are ACID properties in database transactions?",
        "answer": "ACID stands for Atomicity, Consistency, Isolation, and Durability—guaranteeing reliable database transactions.",
        "explanation": "Atomicity ensures all statements in a transaction succeed, or the entire transaction is rolled back ('all-or-nothing'). Consistency ensures the database moves from one valid state to another, enforcing constraints. Isolation ensures concurrent transactions execute without interfering with one another. Durability guarantees committed data survives system crashes.",
        "key_points": [
            "Atomicity: All operations complete or all rollback",
            "Consistency: Schema constraints and integrity rules preserved",
            "Isolation: Transactions executed independently without dirty reads",
            "Durability: Committed updates written to non-volatile storage"
        ],
        "company_tags": ["Stripe", "Visa", "Oracle", "AWS"]
    },
    {
        "id": "int-db-02",
        "category": "SQL",
        "language": "SQL",
        "difficulty": "Medium",
        "question": "What is the difference between Clustered and Non-Clustered Indexes?",
        "answer": "A Clustered Index dictates the physical ordering of data rows on disk (only one per table), whereas a Non-Clustered Index is a separate B-Tree structure storing index keys with row pointers.",
        "explanation": "Because a clustered index alters physical storage order, a table can have only one clustered index (usually the Primary Key). Non-clustered indexes provide fast lookup keys and can be created on multiple columns.",
        "key_points": [
            "Clustered: Defines physical storage layout (1 per table)",
            "Non-Clustered: Separate structure containing pointers back to data (multiple allowed)",
            "Both utilize balanced B-Tree / B+ Tree data structures"
        ],
        "company_tags": ["Microsoft", "Oracle", "Uber"]
    },
    {
        "id": "int-db-03",
        "category": "SQL",
        "language": "SQL",
        "difficulty": "Medium",
        "question": "What is the difference between INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN?",
        "answer": "INNER JOIN returns only matching rows from both tables. LEFT JOIN returns all rows from the left table plus matching rows from the right. RIGHT JOIN returns all rows from the right table. FULL OUTER JOIN returns all rows when there is a match in either.",
        "explanation": "Non-matching columns in outer joins are populated with NULL values.",
        "key_points": [
            "INNER JOIN: Intersection of both tables",
            "LEFT JOIN: All left rows + matched right rows (NULLs for unmatched)",
            "FULL OUTER: Union of both tables with NULLs for unmatched sides"
        ],
        "company_tags": ["Meta", "Amazon", "Salesforce"]
    },

    # --- OPERATING SYSTEMS & NETWORKS ---
    {
        "id": "int-os-01",
        "category": "Operating Systems",
        "language": None,
        "difficulty": "Medium",
        "question": "What is the difference between a Process and a Thread?",
        "answer": "A Process is an independent program execution unit with its own private virtual memory space, while a Thread is a lightweight sub-unit of execution within a process sharing the same address space.",
        "explanation": "Processes are isolated by the OS; inter-process communication (IPC) requires pipes, sockets, or shared memory. Threads within the same process share code, data, and open file descriptors, but each has its own private call stack and registers.",
        "key_points": [
            "Process: Independent address space, heavyweight context switch",
            "Thread: Shared heap/memory, lightweight context switch",
            "Thread communication is fast but requires synchronization (mutexes/locks)"
        ],
        "company_tags": ["Apple", "Google", "Intel", "Nvidia"]
    },
    {
        "id": "int-net-01",
        "category": "Computer Networks",
        "language": None,
        "difficulty": "Medium",
        "question": "Explain the TCP 3-Way Handshake.",
        "answer": "The TCP 3-way handshake establishes a reliable, connection-oriented session between client and server using SYN, SYN-ACK, and ACK packets.",
        "explanation": "Step 1: Client sends a SYN (synchronize sequence number) packet to server. Step 2: Server responds with a SYN-ACK packet acknowledging client sequence and sending its own. Step 3: Client replies with an ACK packet, and the full-duplex TCP socket connection is established.",
        "key_points": [
            "1. Client -> Server: SYN",
            "2. Server -> Client: SYN-ACK",
            "3. Client -> Server: ACK",
            "Establishes initial sequence numbers and socket buffers"
        ],
        "company_tags": ["Cisco", "Cloudflare", "Netflix", "Google"]
    },
    {
        "id": "int-js-01",
        "category": "JavaScript",
        "language": "JavaScript",
        "difficulty": "Medium",
        "question": "Explain the JavaScript Event Loop and Microtask Queue.",
        "answer": "The Event Loop continuously monitors the Call Stack and task queues, executing synchronous stack frames first, then emptying the Microtask Queue (Promises, queueMicrotask), and finally dequeuing Macrotasks (setTimeout, setInterval, I/O).",
        "explanation": "Because JavaScript is single-threaded, asynchronous events are scheduled into queues. Microtasks have higher priority than macrotasks; before rendering or pulling the next macrotask, the engine drains all pending microtasks.",
        "key_points": [
            "Call Stack -> Microtask Queue (Promises) -> Macrotask Queue (Timers/I/O)",
            "Microtasks run immediately after the current synchronous script execution",
            "Prevents blocking the UI thread during async processing"
        ],
        "company_tags": ["Meta", "Netflix", "Vercel", "Airbnb"]
    }
]

def get_all_interview_questions():
    return INTERVIEW_QUESTIONS_DATA

def filter_interview_questions(category: str = None, difficulty: str = None, company: str = None, search: str = None) -> List[Dict[str, Any]]:
    filtered = INTERVIEW_QUESTIONS_DATA
    
    if category and category.lower() != "all":
        filtered = [q for q in filtered if q["category"].lower() == category.lower() or (q.get("language") and q["language"].lower() == category.lower())]
        
    if difficulty and difficulty.lower() != "all":
        filtered = [q for q in filtered if q["difficulty"].lower() == difficulty.lower()]
        
    if company and company.lower() != "all":
        filtered = [q for q in filtered if any(c.lower() == company.lower() for c in q.get("company_tags", []))]
        
    if search:
        s = search.lower().strip()
        filtered = [
            q for q in filtered if (
                s in q["question"].lower() or 
                s in q["answer"].lower() or 
                s in q["category"].lower() or
                any(s in tag.lower() for tag in q.get("company_tags", []))
            )
        ]
        
    return filtered
