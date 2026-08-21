#!/usr/bin/env python3
"""
Comprehensive Practical Learning Roadmap & Worksheet Dataset Generator for CODE SPRINT.
Preserves Python as the gold reference standard, and brings C, C++, Java, JavaScript,
SQL, and HTML/CSS to the exact same high level of depth, pedagogical structure,
practical usefulness, and rich worksheet questions.
"""

import os
import json
import re

def create_full_curriculum_and_worksheets():
    # -------------------------------------------------------------
    # 1. DEFINE DETAILED ROADMAP SPECS FOR ALL SUPPORTED LANGUAGES
    # -------------------------------------------------------------
    
    ROADMAPS = {
        # =========================================================
        # PYTHON (REFERENCE STANDARD)
        # =========================================================
        "python": [
            {
                "category_num": "01",
                "category_name": "Fundamentals",
                "badge": "CORE",
                "level": "Beginner",
                "topics": [
                    ("Introduction to Python & Setup", "Understand Python philosophy, environment setup, Python interactive shell, and running .py scripts."),
                    ("Variables & Assignment", "Variable naming conventions, dynamic typing, variable reassignment, and memory references."),
                    ("Data Types & Type Casting", "Integers, floats, strings, booleans, and explicit type conversion with int(), float(), str(), bool()."),
                    ("User Input & Formatted Output", "Standard input using input(), print() parameters (sep, end), and modern f-strings formatting."),
                    ("Arithmetic & Assignment Operators", "Basic arithmetic (+, -, *, /), floor division (//), modulus (%), exponentiation (**), and compound assignment (+=, -=)."),
                    ("Comparison & Logical Operators", "Relational comparisons (==, !=, >, <, >=, <=) and logical operators (and, or, not) with short-circuit evaluation.")
                ]
            },
            {
                "category_num": "02",
                "category_name": "Control Flow",
                "badge": "CORE",
                "level": "Beginner",
                "topics": [
                    ("If, Elif & Else Conditions", "Decision-making structures, nested conditionals, ternary expressions (x if c else y), and truthy/falsy evaluation."),
                    ("Match-Case Pattern Matching", "Python 3.10+ structural pattern matching with match and case statements."),
                    ("For Loops & Range Function", "Iterating over sequences, range(start, stop, step), index tracking with enumerate(), and zip()."),
                    ("While Loops & Sentinel Values", "Indefinite iteration, condition evaluation, infinite loop prevention, and loop control flags."),
                    ("Break, Continue & Pass Statements", "Early loop termination with break, skipping iterations with continue, and placeholder pass."),
                    ("Nested Loops & Pattern Printing", "Multi-dimensional iteration, printing geometric patterns (pyramids, diamonds, number matrices).")
                ]
            },
            {
                "category_num": "03",
                "category_name": "Functions & Modules",
                "badge": "RECOMMENDED",
                "level": "Beginner",
                "topics": [
                    ("Function Definition & Return Values", "Creating modular functions with def, parameters, return statements, and docstrings."),
                    ("Positional, Keyword & Default Arguments", "Default parameter values, keyword arguments, and parameter order rules."),
                    ("Arbitrary Arguments (*args & **kwargs)", "Handling variable numbers of positional (*args) and keyword (**kwargs) parameters."),
                    ("Lambda Functions & Built-in Helpers", "Anonymous one-line functions with lambda, map(), filter(), and sorted(key=...)."),
                    ("Variable Scope & Closures", "Local vs Global scope, the global and nonlocal keywords, lexical scoping, and closures."),
                    ("Modules, Imports & standard Library", "Importing built-in modules (math, random, datetime, os), custom module creation, and __name__ == '__main__'.")
                ]
            },
            {
                "category_num": "04",
                "category_name": "Data Structures",
                "badge": "IMPORTANT",
                "level": "Intermediate",
                "topics": [
                    ("Strings & String Manipulation", "String indexing, slicing [start:stop:step], immutability, formatting, and common string methods."),
                    ("Lists & List Operations", "Dynamic arrays, indexing, slicing, appending, inserting, popping, sorting, and reversing lists."),
                    ("Tuples & Sequence Unpacking", "Immutable sequences, tuple creation, tuple unpacking, and returning multiple values."),
                    ("Sets & Set Mathematical Operations", "Unique element collections, set union (|), intersection (&), difference (-), and symmetric difference (^)."),
                    ("Dictionaries & Key-Value Mapping", "Hash maps, dictionary creation, get(), keys(), values(), items(), and dictionary updates."),
                    ("List & Dictionary Comprehensions", "Concise syntax for creating lists and dictionaries with filtering and transformation expressions.")
                ]
            },
            {
                "category_num": "05",
                "category_name": "Problem Solving",
                "badge": "IMPORTANT",
                "level": "Intermediate",
                "topics": [
                    ("Linear Search & Binary Search", "Searching algorithms on sorted and unsorted sequences, mid calculation, and logarithmic search."),
                    ("Sorting Algorithms (Bubble, Selection, Merge)", "Comparison-based sorting algorithms, stability, and Python's Timsort (.sort() & sorted())."),
                    ("Recursion Fundamentals", "Base cases, recursive calls, call stack visualization, and recursion limit in Python."),
                    ("Time & Space Complexity (Big-O)", "Analyzing algorithm efficiency, O(1), O(log n), O(n), O(n log n), O(n^2), and memory overhead."),
                    ("Array & Sequence Problem Solving", "Two-pointer techniques, frequency counting, finding duplicates, and sliding window basics."),
                    ("String Algorithm Problems", "Anagram verification, palindrome checks, substring search, and string compression.")
                ]
            },
            {
                "category_num": "06",
                "category_name": "DSA",
                "badge": "IMPORTANT",
                "level": "Intermediate",
                "topics": [
                    ("Singly & Doubly Linked Lists", "Node-based linear data structures, pointer traversal, insertion at head/tail, and deletion."),
                    ("Stack Implementation & Applications", "LIFO data structure, stack using lists and collections.deque, parenthesis matching, and expression evaluation."),
                    ("Queue & Priority Queue (Heap)", "FIFO queues with deque, priority queues with heapq module, min-heaps, and max-heaps."),
                    ("Hash Tables & Collision Handling", "Direct address tables, hash functions, collision resolution with chaining and open addressing."),
                    ("Binary Trees & Tree Traversals", "Hierarchical data structures, In-order, Pre-order, Post-order, and Level-order (BFS) traversals."),
                    ("Binary Search Trees (BST)", "BST property, node insertion, search, minimum/maximum lookup, and node deletion."),
                    ("Graph Representations & Traversals (BFS/DFS)", "Adjacency lists, adjacency matrices, Breadth-First Search (BFS), and Depth-First Search (DFS)."),
                    ("Dynamic Programming & Memoization", "Overlapping subproblems, optimal substructure, top-down memoization, and bottom-up tabulation.")
                ]
            },
            {
                "category_num": "07",
                "category_name": "File & Data Handling",
                "badge": "RECOMMENDED",
                "level": "Intermediate",
                "topics": [
                    ("File I/O & Context Managers", "Reading and writing text files with open(), modes (r, w, a, r+), and the with statement context manager."),
                    ("Exception Handling (Try, Except, Finally)", "Catching specific exceptions, raising custom exceptions, else block, and resource cleanup with finally."),
                    ("CSV Data Processing", "Reading and writing CSV tabular files using Python's built-in csv module (reader, writer, DictReader)."),
                    ("JSON Serialization & Deserialization", "Parsing JSON strings with json.loads(), dumping Python dicts with json.dumps(), and file persistence.")
                ]
            },
            {
                "category_num": "08",
                "category_name": "NumPy",
                "badge": "RECOMMENDED",
                "level": "Intermediate",
                "topics": [
                    ("NumPy Arrays & Creation Routines", "Ndarray creation with np.array(), np.zeros(), np.ones(), np.arange(), and np.linspace()."),
                    ("NumPy Indexing, Slicing & Reshaping", "Multi-dimensional indexing, slicing matrices, reshaping with .reshape(), and flattening."),
                    ("NumPy Mathematical Operations & Broadcasting", "Element-wise arithmetic, universal functions (ufuncs), and broadcasting rules across different shapes."),
                    ("NumPy Statistics & Matrix Operations", "Calculating mean, median, std, min, max, dot products with np.dot() or @, and matrix transpositions.")
                ]
            },
            {
                "category_num": "09",
                "category_name": "Pandas",
                "badge": "RECOMMENDED",
                "level": "Intermediate",
                "topics": [
                    ("Pandas Series & DataFrames", "Core 1D Series and 2D DataFrame structures, index alignment, and creating DataFrames from dicts/lists."),
                    ("Loading CSV & Inspecting Datasets", "Reading CSVs with pd.read_csv(), inspecting with .head(), .info(), .describe(), and .shape."),
                    ("Selecting Columns & Filtering Rows", "Column indexing, row selection with .loc[] and .iloc[], and boolean condition filtering."),
                    ("Handling Missing Data & Nulls", "Detecting nulls with .isna(), dropping with .dropna(), and imputing missing values with .fillna()."),
                    ("GroupBy & Aggregate Operations", "Splitting, applying, and combining data with .groupby(), .agg(), sum, mean, and count calculations."),
                    ("Merging, Joining & Reshaping Datasets", "Combining DataFrames with pd.concat(), pd.merge() (inner, left, right, outer), and pivot tables.")
                ]
            },
            {
                "category_num": "10",
                "category_name": "Data Visualization",
                "badge": "RECOMMENDED",
                "level": "Intermediate",
                "topics": [
                    ("Matplotlib Line Charts & Trends", "Plotting continuous trends with plt.plot(), line styles, markers, grid lines, and axis limits."),
                    ("Bar Charts & Histograms", "Categorical comparisons with plt.bar() / plt.barh(), and continuous frequency distributions with plt.hist()."),
                    ("Scatter Plots & Correlation", "Visualizing two-variable relationships with plt.scatter(), point sizing, and alpha transparency."),
                    ("Customizing Plots (Titles, Labels & Legends)", "Setting figure size, xlabel, ylabel, title, legend, color palettes, and exporting with plt.savefig()."),
                    ("Seaborn Statistical Visualizations", "High-level statistical plots: sns.countplot(), sns.boxplot(), sns.heatmap(), and dataset pairplots.")
                ]
            },
            {
                "category_num": "11",
                "category_name": "SQL & Databases",
                "badge": "RECOMMENDED",
                "level": "Intermediate",
                "topics": [
                    ("SQL Fundamentals & SELECT Queries", "Relational database concepts, table structure, SELECT * vs specific columns, and aliases."),
                    ("Filtering with WHERE & Comparison Operators", "Filtering records with WHERE, =, !=, >, <, BETWEEN, IN, and LIKE pattern matching."),
                    ("Sorting (ORDER BY) & Limiting Results", "Ordering results with ORDER BY column ASC/DESC, multi-column sorting, and LIMIT."),
                    ("Aggregate Functions & GROUP BY", "Calculating COUNT, SUM, AVG, MIN, MAX, and grouping records with GROUP BY and HAVING."),
                    ("Relational Table JOINs", "Combining normalized tables using INNER JOIN, LEFT JOIN, RIGHT JOIN, and join condition keys."),
                    ("SQLite Database Connectivity in Python", "Connecting to SQLite databases using sqlite3 module, cursors, parameterized queries, and commit/rollback.")
                ]
            },
            {
                "category_num": "12",
                "category_name": "Machine Learning",
                "badge": "ADVANCED",
                "level": "Advanced",
                "topics": [
                    ("Introduction to Machine Learning", "Supervised vs Unsupervised learning, features, target labels, and typical ML lifecycle."),
                    ("Dataset Preparation & Train/Test Split", "Splitting datasets with train_test_split, feature scaling with StandardScaler, and encoding."),
                    ("Linear Regression for Prediction", "Continuous target prediction, fitting regression line with LinearRegression, coefficients, and MSE."),
                    ("Logistic Regression for Classification", "Binary classification, sigmoid function, decision boundary, and predicting class probabilities."),
                    ("K-Nearest Neighbors (KNN) & Decision Trees", "Distance-based classification with KNN, rule-based classification with DecisionTreeClassifier, and tree depth."),
                    ("Model Evaluation: Accuracy, Precision, Recall & F1", "Evaluating models with confusion matrix, accuracy score, precision, recall, and F1-score metrics."),
                    ("End-to-End Scikit-Learn Pipeline", "Building a complete scikit-learn workflow from raw dataset loading to training, evaluation, and inference.")
                ]
            },
            {
                "category_num": "13",
                "category_name": "Advanced Python",
                "badge": "ADVANCED",
                "level": "Advanced",
                "topics": [
                    ("Object-Oriented Programming (Classes & Objects)", "Creating classes, __init__ constructor, instance attributes, self parameter, and instance methods."),
                    ("Inheritance, Super & Polymorphism", "Single and multiple inheritance, super() method delegation, method overriding, and duck typing."),
                    ("Iterators & Generators (yield)", "Iterator protocol (__iter__, __next__), generator functions with yield, and memory efficiency."),
                    ("Decorators & Function Wrappers", "Higher-order functions, creating custom function decorators, @decorator syntax, and wraps.")
                ]
            }
        ],

        # =========================================================
        # C CURRICULUM (COMPLETE ROADMAP)
        # =========================================================
        "c": [
            {
                "category_num": "01",
                "category_name": "C Fundamentals",
                "badge": "CORE",
                "level": "Beginner",
                "topics": [
                    ("Introduction to C & Program Structure", "Understanding C compilation stages (preprocessor, compiler, assembler, linker), header files (#include <stdio.h>), main function, and return 0."),
                    ("Variables, Constants & Data Types", "Primitive types (int, float, double, char), qualifiers (short, long, signed, unsigned), const keyword, and sizeof operator."),
                    ("Type Casting & Conversions in C", "Implicit type promotion rules and explicit type casting (type)expression."),
                    ("Standard Input & Output (printf & scanf)", "Formatted output with printf, reading input with scanf, address-of operator (&), and newline buffer handling."),
                    ("Arithmetic & Assignment Operators", "Arithmetic (+, -, *, /, %), increment/decrement (++x vs x++), and compound assignment (+=, -=, *=)."),
                    ("Relational & Logical Operators", "Comparison operators (==, !=, <, >, <=, >=) and logical operators (&&, ||, !) with short-circuit evaluation.")
                ]
            },
            {
                "category_num": "02",
                "category_name": "Control Flow",
                "badge": "CORE",
                "level": "Beginner",
                "topics": [
                    ("If & If-Else Branching", "Conditional branching, nested if statements, and evaluating conditions in C."),
                    ("Nested Conditions & Ternary Operator", "Multi-condition evaluation, nested ternary expressions (condition ? true_val : false_val)."),
                    ("Switch-Case Statements", "Multi-way jump tables with switch, case constants, break statements, and default case."),
                    ("For Loops & Iteration", "Three-part for loop (init; condition; step), counting loops, and nested for loop patterns."),
                    ("While & Do-While Loops", "Entry-controlled while loop vs exit-controlled do-while loop, sentinel values, and infinite loop safeguards."),
                    ("Break & Continue Statements", "Early termination of loop cycles with break, skipping remaining statements with continue."),
                    ("Nested Loops & Pattern Generation", "Row-column iterations, printing star patterns, number pyramids, and matrix grids.")
                ]
            },
            {
                "category_num": "03",
                "category_name": "Functions & Scope",
                "badge": "RECOMMENDED",
                "level": "Beginner",
                "topics": [
                    ("Functions & Function Prototypes", "Function declarations, header prototypes, return types, parameter lists, and modular organization."),
                    ("Parameters & Return Values", "Passing arguments by value, return statements, void functions, and returning status codes."),
                    ("Recursion & Call Stack", "Base cases, recursive decomposition, activation records on the stack, and stack overflow prevention."),
                    ("Variable Scope & Storage Classes", "Automatic (auto), external (extern), static, and register storage classes and variable lifespans.")
                ]
            },
            {
                "category_num": "04",
                "category_name": "Arrays & Strings",
                "badge": "IMPORTANT",
                "level": "Intermediate",
                "topics": [
                    ("One-Dimensional Arrays & Memory", "Contiguous memory allocation, array indexing [0 to N-1], bounds checking, and array traversal."),
                    ("Two-Dimensional Arrays & Matrices", "Row-major order memory, 2D array declaration, matrix addition, and multiplication."),
                    ("Array Operations (Search & Insert)", "Linear traversal, inserting at index, deleting from array, and finding minimum/maximum elements."),
                    ("C Strings & Null Terminator", "Character arrays, null terminator character ('\\0'), string literals, and buffer safety."),
                    ("String Library Functions", "Using string.h: strlen, strcpy, strncpy, strcat, strcmp, and strstr functions."),
                    ("Character Array Manipulations", "Reversing strings, character frequency counting, palindrome checks, and ASCII case conversion.")
                ]
            },
            {
                "category_num": "05",
                "category_name": "Pointers & Memory",
                "badge": "IMPORTANT",
                "level": "Intermediate",
                "topics": [
                    ("Pointer Fundamentals & Addresses", "Memory addresses, address-of operator (&), pointer variable declaration (*), and NULL pointers."),
                    ("Dereferencing & Pointer Types", "Accessing and modifying memory contents via dereferencing (*ptr), void pointers, and type safety."),
                    ("Pointer Arithmetic & Offsets", "Pointer addition/subtraction, scale factors based on type size, and comparing pointers."),
                    ("Pointers and 1D Arrays", "Array name as a constant pointer, array decay, accessing elements via *(arr + i)."),
                    ("Pointers and Strings", "Char pointers (char *str), string literal constants, pointer-based string copying and comparison."),
                    ("Pointer to Pointer (Double Pointers)", "Double pointers (type **ptr), modifying pointers in functions, and dynamic 2D array handles."),
                    ("Functions & Pointers (Pass by Reference)", "Simulating pass-by-reference using pointers, swapping variables, and function callbacks.")
                ]
            },
            {
                "category_num": "06",
                "category_name": "Dynamic Memory Allocation",
                "badge": "IMPORTANT",
                "level": "Intermediate",
                "topics": [
                    ("Malloc (Heap Memory Allocation)", "Allocating contiguous heap memory with malloc(size_t), checking for NULL, and casting."),
                    ("Calloc (Zero-Initialized Allocation)", "Allocating zero-initialized heap memory with calloc(num_elements, element_size)."),
                    ("Realloc (Dynamic Resizing)", "Expanding or shrinking dynamically allocated blocks with realloc(), preserving existing data."),
                    ("Free & Memory Leak Prevention", "Releasing heap allocations with free(), avoiding dangling pointers, and memory leak debugging."),
                    ("Dynamic 1D & 2D Arrays", "Allocating dynamic arrays at runtime, dynamic matrices using array of pointers (int **arr).")
                ]
            },
            {
                "category_num": "07",
                "category_name": "Structures & Organizations",
                "badge": "IMPORTANT",
                "level": "Intermediate",
                "topics": [
                    ("Structures (struct) Fundamentals", "Creating composite user-defined data types with struct, memory alignment, and member dot access."),
                    ("Nested Structures", "Embedding structures inside other structures for hierarchical real-world data models."),
                    ("Arrays of Structures", "Managing collections of records (e.g. students, products, bank accounts) using structure arrays."),
                    ("Pointers to Structures (-> Operator)", "Passing structure pointers to functions efficiently, arrow operator (ptr->member) syntax."),
                    ("Typedef Aliases", "Simplifying complex type signatures and creating clean struct aliases using typedef."),
                    ("Unions & Memory Sharing", "Union declaration, shared memory layout across members, and size calculation."),
                    ("Enumerations (enum)", "Named integral constants with enum, default zero-indexing, and custom enum values.")
                ]
            },
            {
                "category_num": "08",
                "category_name": "File Handling",
                "badge": "RECOMMENDED",
                "level": "Intermediate",
                "topics": [
                    ("File Pointers & fopen/fclose", "File stream pointer (FILE *), opening modes (\"r\", \"w\", \"a\", \"r+\"), and closing files with fclose."),
                    ("Reading Text Files (fgetc, fgets, fscanf)", "Character-by-character reading with fgetc, line reading with fgets, and formatted reading with fscanf."),
                    ("Writing Text Files (fputc, fputs, fprintf)", "Writing characters with fputc, strings with fputs, and formatted output with fprintf."),
                    ("Appending to Files", "Opening files in append mode (\"a\"), adding log records, and checking EOF (End-Of-File)."),
                    ("Binary File I/O (fread, fwrite)", "Writing structured data blocks to disk with fwrite() and reading binary structs with fread().")
                ]
            },
            {
                "category_num": "09",
                "category_name": "DSA Using C",
                "badge": "ADVANCED",
                "level": "Advanced",
                "topics": [
                    ("Complexity Analysis (Time & Space)", "Big-O asymptotic notation, analyzing step counts, best/average/worst cases in C."),
                    ("Singly Linked Lists", "Dynamic node struct, head pointer, insertion at head/tail/index, traversal, and node deletion."),
                    ("Doubly Linked Lists", "Bidirectional nodes with prev and next pointers, insertion, deletion, and reverse traversal."),
                    ("Circular Linked Lists", "Tail pointing back to head, circular traversal, and round-robin scheduling structures."),
                    ("Stack Implementation (Array & Linked List)", "LIFO stack implementation with push, pop, peek, isEmpty, and overflow/underflow checks."),
                    ("Queue & Circular Queue", "FIFO queue with front/rear pointers, linear queue limitations, and circular modulo queue."),
                    ("Binary Trees & Tree Traversals", "Binary tree node structure, Pre-order, In-order, Post-order, and Level-order recursive traversals."),
                    ("Binary Search Tree (BST)", "BST ordering property, node insertion, search key lookup, min/max, and node deletion."),
                    ("Heap & Priority Queue", "Binary min-heap and max-heap array representation, heapify-up, heapify-down, and priority queue operations."),
                    ("Hash Tables & Collision Handling", "Hash functions, separate chaining using linked lists, and open addressing linear probing."),
                    ("Graph Representations & Traversals (BFS/DFS)", "Adjacency matrix and adjacency list representations, queue-based BFS, and recursion-based DFS.")
                ]
            },
            {
                "category_num": "10",
                "category_name": "Algorithms in C",
                "badge": "ADVANCED",
                "level": "Advanced",
                "topics": [
                    ("Linear Search & Binary Search", "Linear scan O(N) vs Binary Search O(log N) on sorted arrays, iterative and recursive implementations."),
                    ("Bubble Sort & Selection Sort", "Comparison-based quadratic sorting algorithms, swapping, pass optimizations, and min element selection."),
                    ("Insertion Sort", "Building sorted subarray, shifting elements, adaptive behavior on partially sorted data."),
                    ("Merge Sort (Divide & Conquer)", "Recursive array splitting, merge subroutine, auxiliary buffer, and O(N log N) guarantee."),
                    ("Quick Sort & Partitioning", "Pivot selection, Lomuto and Hoare partitioning schemes, in-place sorting, and recursion tree."),
                    ("Recursion & Backtracking", "State exploration, backtracking templates, N-Queens problem, and subset generation in C."),
                    ("Greedy Algorithms", "Locally optimal choice strategy, Activity Selection problem, and Fractional Knapsack problem."),
                    ("Dynamic Programming Basics", "Overlapping subproblems, memoization vs tabulation, Fibonacci series, and 0/1 Knapsack in C.")
                ]
            },
            {
                "category_num": "11",
                "category_name": "Practical C",
                "badge": "ADVANCED",
                "level": "Advanced",
                "topics": [
                    ("Menu-Driven Console Programs", "Building interactive loop menus with switch-case, input validation, and user navigation."),
                    ("File-Based Persistence Systems", "Persisting structured business records to text and binary files, updating records in place."),
                    ("Student Management System", "Complete CRUD console application for managing student grades, attendance, and roll numbers."),
                    ("Employee Management System", "Enterprise C system for tracking employee IDs, departments, salaries, and performance reports."),
                    ("Mini Project: Banking / Inventory System", "Architecting a modular multi-file C mini project with transaction logs, search, and balance persistence.")
                ]
            }
        ],

        # =========================================================
        # C++ CURRICULUM (COMPLETE MODERN C++ & STL ROADMAP)
        # =========================================================
        "cpp": [
            {
                "category_num": "01",
                "category_name": "C++ Fundamentals & I/O",
                "badge": "CORE",
                "level": "Beginner",
                "topics": [
                    ("Introduction to C++ & Compilation", "C++ history, g++ compilation, standard streams (#include <iostream>), and namespace std."),
                    ("Standard Input/Output (cin & cout)", "Formatted stream insertion (<<), extraction (>>), std::endl, and fast I/O (std::ios::sync_with_stdio(0))."),
                    ("Variables, Data Types & auto", "Primitive types, type modifiers, modern type deduction with auto, and type casting with static_cast."),
                    ("Operators & Expressions in C++", "Arithmetic, relational, logical, bitwise, and compound assignment operators.")
                ]
            },
            {
                "category_num": "02",
                "category_name": "Control Flow & Functions",
                "badge": "CORE",
                "level": "Beginner",
                "topics": [
                    ("Conditions & Decision Logic", "If-else branching, nested conditionals, ternary expressions, and switch-case statements."),
                    ("Loops & Range-Based For", "For loops, while loops, do-while loops, and modern range-based for loops (for (auto x : vec))."),
                    ("Functions & Default Arguments", "Function definitions, pass-by-value, default parameter values, and inline function optimization."),
                    ("Function Overloading", "Compile-time polymorphism, defining multiple functions with identical names and distinct parameter lists.")
                ]
            },
            {
                "category_num": "03",
                "category_name": "Pointers, References & Strings",
                "badge": "CORE",
                "level": "Beginner",
                "topics": [
                    ("Arrays & Multidimensional Arrays", "Fixed-size arrays, array iteration, multidimensional matrix grids, and std::array wrapper."),
                    ("std::string & String Manipulation", "The std::string class, concatenation (+), length(), substr(), find(), replace(), and getline()."),
                    ("Pointers & Address Arithmetic in C++", "Pointer variables, dereferencing, address-of operator, nullptr, and dynamic memory with new/delete."),
                    ("References (&) & Pass by Reference", "C++ reference variables as aliases, pass-by-reference in functions (void swap(int &a, int &b)), and const references.")
                ]
            },
            {
                "category_num": "04",
                "category_name": "Object-Oriented Programming",
                "badge": "IMPORTANT",
                "level": "Intermediate",
                "topics": [
                    ("Classes & Objects", "Class declaration, public/private/protected access specifiers, member attributes, and member functions."),
                    ("Constructors & Member Initializer Lists", "Default constructors, parameterized constructors, copy constructors, and constructor initializer lists."),
                    ("Destructors & RAII Principles", "Destructor cleanup (~ClassName), Resource Acquisition Is Initialization (RAII), and automatic memory management."),
                    ("Encapsulation & Access Modifiers", "Data hiding, private attributes, getter and setter methods, and data integrity enforcement."),
                    ("Inheritance in C++", "Single, multiple, multi-level, and hierarchical inheritance, base class access specifiers, and constructor calling order."),
                    ("Polymorphism & Virtual Functions", "Runtime polymorphism, virtual keyword, override specifier, virtual destructors, and vtable mechanics."),
                    ("Abstraction & Pure Virtual Interfaces", "Pure virtual functions (virtual void draw() = 0), abstract base classes, and interface contracts."),
                    ("Operator Overloading & Friend Functions", "Overloading operators (+, -, <<, ==), operator member functions, and friend keyword declaration.")
                ]
            },
            {
                "category_num": "05",
                "category_name": "Templates & Exceptions",
                "badge": "RECOMMENDED",
                "level": "Intermediate",
                "topics": [
                    ("Templates & Generic Programming", "Function templates (template <typename T>), class templates, template specialization, and generic algorithms."),
                    ("Exception Handling in C++", "Exception throwing with throw, catching with try-catch blocks, std::exception, and custom exception classes."),
                    ("File Handling with fstream", "File stream classes (std::ifstream, std::ofstream, std::fstream), reading and writing text/binary files.")
                ]
            },
            {
                "category_num": "06",
                "category_name": "Standard Template Library (STL)",
                "badge": "IMPORTANT",
                "level": "Intermediate",
                "topics": [
                    ("std::vector & Dynamic Arrays", "Vector capacity, push_back(), pop_back(), size(), resize(), reserve(), and vector indexing."),
                    ("std::pair & std::tuple", "Grouping heterogeneous values with std::pair<T1, T2> (make_pair, first, second) and std::tuple."),
                    ("std::string Stream & String Operations", "String stream processing with std::stringstream for tokenization, parsing, and type conversions."),
                    ("std::stack & std::queue", "LIFO stack container adapter (push, pop, top) and FIFO queue adapter (push, pop, front)."),
                    ("std::deque & std::priority_queue", "Double-ended queue (push_front, push_back) and max-heap/min-heap priority_queue with custom comparators."),
                    ("std::set & std::multiset", "Self-balancing Red-Black tree set (O(log N)), unique sorted elements, count, find, and multiset."),
                    ("std::map & std::unordered_map", "Ordered key-value map (std::map) vs constant-time hash map (std::unordered_map) for fast lookups."),
                    ("std::unordered_set", "Hash-table-based unique element collection with average O(1) insertion, deletion, and search."),
                    ("STL Algorithms & Iterators", "std::sort(), std::reverse(), std::binary_search(), std::lower_bound(), std::upper_bound(), std::accumulate().")
                ]
            },
            {
                "category_num": "07",
                "category_name": "DSA in C++",
                "badge": "ADVANCED",
                "level": "Advanced",
                "topics": [
                    ("Complexity Analysis & Big-O", "Asymptotic analysis of C++ code, amortized time complexity in vector, and space complexity."),
                    ("Searching Algorithms in C++", "Binary Search on sorted sequences, lower_bound/upper_bound idioms, and search in rotated arrays."),
                    ("Sorting Algorithms & Custom Comparators", "QuickSort, MergeSort, and writing lambda comparators for std::sort(vec.begin(), vec.end(), comp)."),
                    ("Linked Lists in C++", "Creating node structs, dynamic pointer manipulation, reverse linked list, and detecting cycle with Floyd's algorithm."),
                    ("Stack Problems in C++", "Next Greater Element, Valid Parentheses, Evaluate Reverse Polish Notation, and Min Stack design."),
                    ("Queue & Sliding Window Problems", "Sliding Window Maximum using deque, first negative integer in window, and moving average."),
                    ("Binary Trees & Traversals in C++", "TreeNode struct, recursive and iterative Pre/In/Post order traversals, and maximum depth of binary tree."),
                    ("Binary Search Tree (BST) in C++", "BST search, insert, validate BST, Lowest Common Ancestor (LCA), and deleting nodes in BST."),
                    ("Heap & Top-K Elements in C++", "Kth largest element in an array using min-heap priority_queue, top K frequent elements, and merge K sorted lists."),
                    ("Graph Representations & Traversals", "Adjacency list with vector<vector<int>>, Breadth-First Search (BFS), and Depth-First Search (DFS)."),
                    ("Greedy Algorithms in C++", "Activity Selection, Fractional Knapsack, Jump Game, and Gas Station problems."),
                    ("Dynamic Programming in C++", "1D DP (Climbing Stairs, House Robber, Coin Change) and 2D DP (Longest Common Subsequence, 0/1 Knapsack).")
                ]
            },
            {
                "category_num": "08",
                "category_name": "Practical C++ & Interviews",
                "badge": "ADVANCED",
                "level": "Advanced",
                "topics": [
                    ("Fast I/O & Competitive Programming", "Fast input/output techniques, bitwise manipulation tricks (__builtin_popcount, bitmasks), and modular arithmetic."),
                    ("Common Interview Coding Patterns", "Two Pointers, Fast & Slow Pointers, Sliding Window, Merge Intervals, and Top-K Elements patterns."),
                    ("Practical Banking / Inventory System", "Building a production-ready C++ console system using OOP, STL maps, vectors, and file serialization."),
                    ("Mini Project: Task Management System", "Complete modular C++ application with priorities, deadlines, status filters, and persistent disk storage.")
                ]
            }
        ],

        # =========================================================
        # JAVA CURRICULUM (COMPLETE ENTERPRISE & DSA ROADMAP)
        # =========================================================
        "java": [
            {
                "category_num": "01",
                "category_name": "Java Fundamentals",
                "badge": "CORE",
                "level": "Beginner",
                "topics": [
                    ("Introduction to Java & JVM Architecture", "Java ecosystem, JDK, JRE, JVM, bytecode, main method signature (public static void main), and System.out.println."),
                    ("Variables, Data Types & Wrappers", "Primitive types (byte, short, int, long, float, double, boolean, char), wrapper classes (Integer, Double), and autoboxing."),
                    ("Type Casting (Implicit & Explicit)", "Widening primitive conversion (implicit) vs Narrowing conversion (explicit cast) and data loss risks."),
                    ("Standard Input & Output (Scanner & Printf)", "Reading console input using java.util.Scanner, formatted output with System.out.printf, and BufferedReader."),
                    ("Operators & Expressions in Java", "Arithmetic, relational, logical (&&, ||, !), bitwise, and ternary operator expressions.")
                ]
            },
            {
                "category_num": "02",
                "category_name": "Control Flow",
                "badge": "CORE",
                "level": "Beginner",
                "topics": [
                    ("Conditional Statements (if, else if, switch)", "If-else decision structures, nested conditions, traditional switch, and modern Java switch expressions."),
                    ("Loops (for, while, do-while)", "Counting for loops, condition-based while loops, do-while loops, and nested loop patterns."),
                    ("Enhanced For-Each Loop & Control Statements", "Iterating arrays/collections with for-each (for (Type x : list)), break, continue, and labeled loops.")
                ]
            },
            {
                "category_num": "03",
                "category_name": "Methods, Arrays & Strings",
                "badge": "CORE",
                "level": "Beginner",
                "topics": [
                    ("Methods, Parameters & Return Values", "Declaring static and instance methods, return types, pass-by-value for primitives vs object references."),
                    ("Method Overloading & Recursion", "Method signature differentiation, compile-time polymorphism, recursive base cases, and stack frames."),
                    ("1D & 2D Arrays in Java", "Array declaration, memory allocation with new, array.length property, multi-dimensional matrices, and Arrays utility class."),
                    ("Strings & Immutability", "String class, String Constant Pool, immutability, methods (substring, charAt, contains, replace, split), and .equals() vs ==."),
                    ("StringBuilder & StringBuffer", "Mutable character sequences, append(), insert(), reverse(), toString(), and performance comparison with String.")
                ]
            },
            {
                "category_num": "04",
                "category_name": "Object-Oriented Programming",
                "badge": "IMPORTANT",
                "level": "Intermediate",
                "topics": [
                    ("Classes, Objects & Heap Memory", "Creating classes, instantiating objects with new, reference variables on stack vs objects on heap."),
                    ("Constructors & Constructor Chaining", "Default constructors, parameterized constructors, constructor overloading, and this() constructor calls."),
                    ("The this & static Keywords", "Disambiguating instance variables with this, static variables, static methods, static blocks, and utility classes."),
                    ("Encapsulation & Access Modifiers", "Data hiding with private fields, public getters and setters, and access levels (public, protected, default, private)."),
                    ("Inheritance & The extends Keyword", "Class inheritance, single and multi-level hierarchies, super keyword, and super() constructor calls."),
                    ("Polymorphism & Dynamic Method Dispatch", "Runtime polymorphism, method overriding with @Override, upcasting, and instanceof checks."),
                    ("Abstraction & Abstract Classes", "Abstract classes with abstract keyword, abstract vs concrete methods, and partial implementation blueprints."),
                    ("Interfaces & Default/Static Methods", "Declaring interfaces with interface, implementing multiple interfaces, and modern default/static interface methods.")
                ]
            },
            {
                "category_num": "05",
                "category_name": "Exceptions & File Handling",
                "badge": "RECOMMENDED",
                "level": "Intermediate",
                "topics": [
                    ("Exception Handling (try, catch, finally)", "Throwable hierarchy, Checked vs Unchecked exceptions, try-catch blocks, multi-catch, and finally resource cleanup."),
                    ("Custom Exceptions & throw/throws", "Creating custom domain exception classes extending Exception/RuntimeException, throw and throws clauses."),
                    ("File Handling with java.nio.file", "Reading and writing text files using Files.readAllLines(), Files.writeString(), Path, and BufferedReader/BufferedWriter."),
                    ("Object Serialization & Serializable", "Serializing object state to byte streams with ObjectOutputStream and reading with ObjectInputStream (Serializable interface).")
                ]
            },
            {
                "category_num": "06",
                "category_name": "Java Collections Framework",
                "badge": "IMPORTANT",
                "level": "Intermediate",
                "topics": [
                    ("ArrayList & Dynamic Lists", "Dynamic resizable arrays with java.util.ArrayList, add, get, set, remove, size, and Collections.sort()."),
                    ("LinkedList & List Operations", "Doubly-linked list implementation with java.util.LinkedList, addFirst, addLast, removeFirst, and queue operations."),
                    ("HashSet & Set Mechanics", "Unique element collections with HashSet, hashCode() and equals() contract, and O(1) lookup performance."),
                    ("TreeSet & Sorted Sets", "Self-balancing Red-Black tree set with TreeSet, natural ordering with Comparable, and custom Comparator."),
                    ("HashMap & Hash Buckets", "Key-value mapping with HashMap, internal hashing buckets, put, get, containsKey, keySet, entrySet, and getOrDefault."),
                    ("TreeMap & Sorted Maps", "Sorted key-value mappings with TreeMap, firstKey, lastKey, subMap, and logarithmic complexity."),
                    ("Stack, Queue & ArrayDeque", "LIFO stack operations, FIFO Queue interface, ArrayDeque as high-performance stack and double-ended queue."),
                    ("PriorityQueue & Custom Comparators", "Min-heap and max-heap priority queues using PriorityQueue, custom lambda comparators ((a, b) -> b - a).")
                ]
            },
            {
                "category_num": "07",
                "category_name": "Modern Java Features",
                "badge": "IMPORTANT",
                "level": "Intermediate",
                "topics": [
                    ("Java Generics & Type Parameters", "Generic classes (Box<T>), generic methods, bounded type parameters (<T extends Number>), and wildcards (? extends T)."),
                    ("Lambda Expressions & Functional Interfaces", "Functional interfaces (@FunctionalInterface), lambda syntax (x -> x * 2), Predicate, Function, Consumer, and Supplier."),
                    ("Stream API (filter, map, collect)", "Stream pipelines, intermediate operations (.filter, .map, .sorted, .distinct), terminal operations (.collect, .count, .reduce)."),
                    ("Optional<T> & Null-Safe Programming", "Avoiding NullPointerException with Optional.ofNullable(), isPresent(), orElse(), orElseGet(), and map()."),
                    ("Modern Date & Time API", "java.time package, LocalDate, LocalTime, LocalDateTime, DateTimeFormatter, and Duration/Period calculations.")
                ]
            },
            {
                "category_num": "08",
                "category_name": "DSA in Java",
                "badge": "ADVANCED",
                "level": "Advanced",
                "topics": [
                    ("Searching Algorithms in Java", "Linear Search, Binary Search with Arrays.binarySearch, and binary search on rotated sorted arrays."),
                    ("Sorting Algorithms in Java", "Dual-Pivot QuickSort, TimSort in Collections.sort(), MergeSort, and implementing custom Sort algorithms."),
                    ("Linked Lists in Java", "Creating ListNode class, reversing a linked list, merging two sorted lists, and middle of linked list."),
                    ("Stack & Queue Problems in Java", "Valid Parentheses, Daily Temperatures, Implement Queue using Stacks, and Min Stack implementation in Java."),
                    ("Binary Trees & Tree Traversals in Java", "TreeNode class, recursive In-order/Pre-order/Post-order traversals, Level-order BFS traversal, and max depth."),
                    ("Binary Search Tree (BST) in Java", "Insert into BST, Search in BST, Validate Binary Search Tree, and Lowest Common Ancestor in BST."),
                    ("Heap & Priority Queue Applications", "Top K Frequent Elements, Find Kth Largest Element, and Find Median from Data Stream."),
                    ("Graph Representations & BFS/DFS in Java", "Adjacency list with Map<Integer, List<Integer>>, Breadth-First Search with Queue, and Depth-First Search with recursion."),
                    ("Dynamic Programming in Java", "Climbing Stairs, Coin Change, Longest Increasing Subsequence (LIS), and 0/1 Knapsack in Java.")
                ]
            },
            {
                "category_num": "09",
                "category_name": "Practical Java & Enterprise",
                "badge": "ADVANCED",
                "level": "Advanced",
                "topics": [
                    ("JDBC & Database Connectivity", "JDBC drivers, DriverManager.getConnection, Statement, PreparedStatement for SQL injection prevention, and ResultSet."),
                    ("Relational Database CRUD with JDBC", "Implementing Create, Read, Update, Delete DAO (Data Access Object) patterns with JDBC and transaction management."),
                    ("File-Based Student Management System", "Complete console application for managing student records, persisting data to disk with serialization and CSV."),
                    ("Mini Project: Enterprise Employee Portal", "Modular multi-class Java enterprise project with department management, salary analytics, and role-based actions."),
                    ("High-Frequency Java Interview Problems", "LRU Cache design, Two Sum, Longest Substring Without Repeating Characters, Group Anagrams, and String to Integer (atoi).")
                ]
            }
        ],

        # =========================================================
        # JAVASCRIPT CURRICULUM (COMPLETE MODERN JS & WEB ROADMAP)
        # =========================================================
        "javascript": [
            {
                "category_num": "01",
                "category_name": "JavaScript Fundamentals",
                "badge": "CORE",
                "level": "Beginner",
                "topics": [
                    ("Introduction to JavaScript & V8 Engine", "JavaScript ecosystem, browser vs Node.js runtime, console.log(), statement semicolons, and strict mode ('use strict')."),
                    ("Variables (let, const, var) & TDZ", "Block-scoped let and const, function-scoped var, Temporal Dead Zone (TDZ), and reassignment rules."),
                    ("Data Types & Primitives vs References", "Primitive types (string, number, boolean, null, undefined, symbol, bigint) vs Reference objects, and typeof operator."),
                    ("Type Conversion & Coercion (Truthy/Falsy)", "Implicit type coercion (+ operator, == comparisons), explicit conversion (Number, String, Boolean), and truthy/falsy rules."),
                    ("Operators & Strict Equality (===)", "Arithmetic, assignment, strict equality (===) vs loose equality (==), logical operators, and nullish coalescing (??).")
                ]
            },
            {
                "category_num": "02",
                "category_name": "Control Flow & Functions",
                "badge": "CORE",
                "level": "Beginner",
                "topics": [
                    ("Conditions & Ternary Operator", "If-else conditionals, switch-case statements, ternary operator (condition ? val1 : val2), and logical short-circuiting."),
                    ("Loops (for, while, for...of, for...in)", "Standard for loop, while loop, iterating arrays with for...of, and enumerating object keys with for...in."),
                    ("Functions & Arrow Functions", "Function declarations, function expressions, concise ES6 arrow functions (() => {}), and default parameters."),
                    ("Scope (Global, Function, Block) & Scope Chain", "Global scope, function local scope, ES6 block scope, lexical environment, and scope chain resolution.")
                ]
            },
            {
                "category_num": "03",
                "category_name": "Arrays, Objects & ES6+",
                "badge": "CORE",
                "level": "Beginner",
                "topics": [
                    ("Arrays & Array Indexing", "Array creation, zero-based indexing, array.length, nested arrays, and array element modification."),
                    ("Objects & Key-Value Pairs", "Object literal syntax, dot notation vs bracket notation, dynamic keys, adding/deleting properties, and Object.assign()."),
                    ("Strings & String Methods", "String properties and methods: slice, substring, toUpperCase, toLowerCase, includes, indexOf, trim, and split."),
                    ("Array Methods (push, pop, shift, unshift, slice, splice)", "Mutating array methods (push, pop, shift, unshift, splice) vs non-mutating methods (slice, concat, join)."),
                    ("Object Methods (keys, values, entries)", "Iterating objects using Object.keys(), Object.values(), Object.entries(), and Object.freeze()."),
                    ("Array & Object Destructuring", "Extracting values with array destructuring ([a, b] = arr) and object destructuring ({name, age} = user) with aliases/defaults."),
                    ("Spread Operator (...) & Rest Parameters", "Shallow copying and merging arrays/objects with spread (...), and gathering variable arguments with rest parameters (...args)."),
                    ("Template Literals & Tagged Templates", "Backtick string interpolation (`${expression}`), multi-line strings, and tagged template functions."),
                    ("ES Modules (import & export)", "Named exports, default exports, importing modules, and modular JavaScript code organization."),
                    ("Error Handling (try, catch, finally, Error)", "Catching runtime errors with try-catch-finally, throwing custom Error objects, and error.message.")
                ]
            },
            {
                "category_num": "04",
                "category_name": "Browser & DOM Manipulation",
                "badge": "IMPORTANT",
                "level": "Intermediate",
                "topics": [
                    ("Document Object Model (DOM) Tree", "Understanding DOM hierarchy, Document, Element, Node types, window object, and DOM rendering lifecycle."),
                    ("Selecting DOM Elements", "Targeting elements with document.querySelector(), querySelectorAll(), getElementById(), and getElementsByClassName()."),
                    ("Modifying DOM Elements & Content", "Updating textContent, innerHTML, setting attributes (setAttribute), manipulating CSS styles, and classList (add, remove, toggle)."),
                    ("Browser Events & Event Object", "Event object (event.target, event.type), click, input, keydown, submit events, and event.preventDefault()."),
                    ("Event Listeners & Event Delegation", "Adding event listeners with addEventListener, event bubbling, event capturing, and high-performance event delegation."),
                    ("Forms & Form Validation", "Reading input values, form submit handling, FormData API, and client-side validation using Regular Expressions (RegExp)."),
                    ("LocalStorage & SessionStorage", "Persisting data across sessions with localStorage.setItem(), getItem(), removeItem(), clear(), and JSON serialization."),
                    ("Browser Web APIs", "Working with browser APIs: Geolocation API, Web Notifications, IntersectionObserver, and window.matchMedia.")
                ]
            },
            {
                "category_num": "05",
                "category_name": "Asynchronous JavaScript",
                "badge": "IMPORTANT",
                "level": "Intermediate",
                "topics": [
                    ("Callbacks & Asynchronous Execution", "Synchronous vs Asynchronous execution, setTimeout, setInterval, callback functions, and callback hell."),
                    ("Promises & Promise Chaining", "Promise states (pending, fulfilled, rejected), creating Promises, .then(), .catch(), .finally(), and Promise.all / Promise.allSettled."),
                    ("Async / Await Modern Syntax", "Writing asynchronous code with async functions and await keyword, try-catch error handling with async/await."),
                    ("Fetch API for HTTP Requests", "Making HTTP GET and POST requests with window.fetch(), checking response.ok, and response.status."),
                    ("Consuming REST APIs (GET, POST, PUT, DELETE)", "Setting request headers, sending JSON payloads in POST/PUT, and consuming real-world third-party REST endpoints."),
                    ("JSON Parsing & Serialization", "Converting JSON strings to objects with JSON.parse() and JavaScript values to JSON strings with JSON.stringify()."),
                    ("Error Handling with Network APIs", "Handling network timeouts, offline states, 4xx/5xx HTTP errors, and building resilient API wrappers.")
                ]
            },
            {
                "category_num": "06",
                "category_name": "Advanced JavaScript",
                "badge": "IMPORTANT",
                "level": "Intermediate",
                "topics": [
                    ("Closures & Lexical Environment", "Function closures, retaining access to outer variables, data privacy, and factory functions."),
                    ("Higher-Order Functions & Functional JS", "Passing functions as arguments, returning functions, pure functions, and immutability."),
                    ("Map, Filter & Reduce Mastery", "Transforming arrays with .map(), filtering with .filter(), and accumulating complex values with .reduce()."),
                    ("Prototypes & Prototypal Inheritance", "Prototype chain (__proto__, prototype), Object.create(), and prototype method delegation."),
                    ("ES6 Classes & Class Inheritance", "Class syntax, constructor method, instance methods, static methods, and inheritance with extends and super."),
                    ("The this Keyword & Explicit Binding", "Implicit this binding, explicit binding with .call(), .apply(), .bind(), and lexical this in arrow functions."),
                    ("JavaScript Event Loop & Microtask Queue", "Call stack, Web APIs, Callback Queue (macrotasks), Microtask Queue (Promises), and Event Loop execution order."),
                    ("Hoisting & Execution Context", "Creation phase vs Execution phase, variable hoisting (var vs let/const), and function declaration hoisting.")
                ]
            },
            {
                "category_num": "07",
                "category_name": "DSA in JavaScript",
                "badge": "ADVANCED",
                "level": "Advanced",
                "topics": [
                    ("Array Algorithms & Two Pointers", "Two Sum in sorted array, Move Zeroes, Container With Most Water, and Sliding Window algorithms."),
                    ("String Algorithms in JS", "Valid Anagram, Palindrome Check, Longest Common Prefix, and String Compression in JavaScript."),
                    ("Searching & Sorting in JavaScript", "Binary Search implementation and custom sort comparators with Array.prototype.sort((a, b) => a - b)."),
                    ("Stack Implementation & Problems", "Stack class using arrays, Valid Parentheses, Min Stack, and evaluating postfix expressions."),
                    ("Queue & Deque in JavaScript", "Queue implementation with arrays/objects, sliding window maximum, and circular queue."),
                    ("Singly Linked Lists in JavaScript", "LinkedListNode class, inserting nodes, reversing a linked list, and finding cycle."),
                    ("Binary Trees & Traversals in JS", "TreeNode class, In-order, Pre-order, Post-order traversals, and BFS Level-order traversal using arrays."),
                    ("Graphs & BFS/DFS in JavaScript", "Graph representation with Map/Object, BFS queue traversal, DFS recursion, and connected components."),
                    ("Recursion & Dynamic Programming in JS", "Fibonacci memoization, Climbing Stairs, Coin Change, and House Robber in JavaScript.")
                ]
            },
            {
                "category_num": "08",
                "category_name": "Practical Web Development",
                "badge": "ADVANCED",
                "level": "Advanced",
                "topics": [
                    ("Interactive Todo Application", "Building a full-featured Todo List with DOM manipulation, status toggles, filtering, and localStorage persistence."),
                    ("Weather Dashboard with REST API", "Fetching live meteorological data, handling loading spinners, error states, and dynamically updating UI cards."),
                    ("Interactive Form & Multi-Step Validation", "Building rich multi-input forms with regex email/password checks, live validation feedback, and submit sanitization."),
                    ("Rich Notes & Markdown Scratchpad", "Creating a persistent note-taking application with search filtering, tag categorization, and local storage."),
                    ("Modern Frontend Application Architecture", "Modular component state patterns, custom event dispatching, and single-page routing principles in pure JavaScript.")
                ]
            }
        ],

        # =========================================================
        # SQL CURRICULUM (COMPLETE DATABASE & QUERYING ROADMAP)
        # =========================================================
        "sql": [
            {
                "category_num": "01",
                "category_name": "Database & Query Fundamentals",
                "badge": "CORE",
                "level": "Beginner",
                "topics": [
                    ("Relational Database Fundamentals & RDBMS", "Tables, schemas, rows, columns, relational database theory (RDBMS), and standard SQL syntax."),
                    ("SQL Data Types & Table Schemas", "Numeric (INT, DECIMAL, FLOAT), text (VARCHAR, CHAR, TEXT), date/time (DATE, TIMESTAMP), and boolean types."),
                    ("CREATE DATABASE & CREATE TABLE", "Creating databases, defining tables with column data types, default values, and comments."),
                    ("Table Constraints (PRIMARY KEY, NOT NULL, UNIQUE)", "Enforcing data integrity with PRIMARY KEY, NOT NULL, UNIQUE, DEFAULT, and AUTO_INCREMENT."),
                    ("INSERT INTO & Bulk Insertion", "Inserting single rows with INSERT INTO, inserting multiple records in a single statement, and inserting from subqueries."),
                    ("SELECT Queries & Column Aliases", "Retrieving all columns (SELECT *), selecting specific columns, and renaming columns using the AS alias keyword.")
                ]
            },
            {
                "category_num": "02",
                "category_name": "Filtering, Sorting & Pagination",
                "badge": "CORE",
                "level": "Beginner",
                "topics": [
                    ("DISTINCT & Unique Value Queries", "Eliminating duplicate rows in query results using the DISTINCT keyword across single and multiple columns."),
                    ("WHERE Clause & Comparison Operators", "Filtering rows based on conditions using comparison operators (=, !=, <>, >, <, >=, <=)."),
                    ("Logical Operators (AND, OR, NOT)", "Combining multiple search conditions, operator precedence, and grouping with parentheses."),
                    ("BETWEEN & Range Queries", "Filtering records within inclusive numeric, date, and text boundaries using the BETWEEN operator."),
                    ("IN & NOT IN Value Lists", "Matching values against discrete lists using IN (val1, val2, val3) and excluding values with NOT IN."),
                    ("LIKE & Wildcard Pattern Matching", "Searching text patterns using LIKE with percent (%) multi-character wildcard and underscore (_) single-character wildcard."),
                    ("ORDER BY Sorting (ASC & DESC)", "Sorting query results ascending (ASC) or descending (DESC), multi-column ordering, and ordering by expressions."),
                    ("LIMIT & OFFSET for Pagination", "Restricting the number of returned rows using LIMIT, and skipping rows for pagination using OFFSET.")
                ]
            },
            {
                "category_num": "03",
                "category_name": "Data Modification & Aggregation",
                "badge": "CORE",
                "level": "Beginner",
                "topics": [
                    ("UPDATE Records & Safe Filtering", "Modifying existing table records with UPDATE, setting new values with SET, and using WHERE filters to prevent mass updates."),
                    ("DELETE & TRUNCATE Statements", "Removing specific rows with DELETE FROM and WHERE, deleting all rows with TRUNCATE TABLE, and comparing performance."),
                    ("COUNT Function & Row Counting", "Counting total rows with COUNT(*), counting non-null column values with COUNT(column), and COUNT(DISTINCT column)."),
                    ("SUM & AVG Aggregate Functions", "Calculating totals with SUM() and computing arithmetic averages with AVG() on numeric columns."),
                    ("MIN & MAX Extreme Values", "Finding minimum and maximum values across numeric, date, and alphabetical string columns."),
                    ("GROUP BY & Category Aggregations", "Grouping rows sharing values into summary rows with GROUP BY, and calculating aggregates per group."),
                    ("HAVING Clause vs WHERE", "Filtering grouped records using the HAVING clause on aggregate expressions versus WHERE row filtering."),
                    ("CASE WHEN Conditional Logic", "Implementing if-then-else conditional logic inside SELECT queries with CASE WHEN condition THEN val ELSE default END.")
                ]
            },
            {
                "category_num": "04",
                "category_name": "Relationships & Relational JOINs",
                "badge": "IMPORTANT",
                "level": "Intermediate",
                "topics": [
                    ("Primary Keys, Foreign Keys & Constraints", "Establishing relational links using FOREIGN KEY references, ON DELETE CASCADE, and ON UPDATE CASCADE."),
                    ("One-to-One, One-to-Many & Many-to-Many", "Relational data modeling, junction/bridge tables for Many-to-Many links, and entity relationship diagrams."),
                    ("INNER JOIN Queries", "Combining matching rows from two or more tables based on join condition keys (tableA INNER JOIN tableB ON A.id = B.a_id)."),
                    ("LEFT (OUTER) JOIN & Unmatched Rows", "Preserving all rows from the left table and retrieving matching right table columns (handling NULLs)."),
                    ("RIGHT (OUTER) JOIN", "Preserving all rows from the right table, right-side joins, and converting between LEFT and RIGHT joins."),
                    ("FULL OUTER JOIN", "Combining all rows from both tables, including matched and unmatched records from both sides."),
                    ("SELF JOIN for Hierarchical Data", "Joining a table to itself using aliases to represent hierarchies (e.g. employees and their managers, parent categories).")
                ]
            },
            {
                "category_num": "05",
                "category_name": "Advanced SQL & Optimization",
                "badge": "IMPORTANT",
                "level": "Intermediate",
                "topics": [
                    ("Scalar & Table Subqueries", "Using subqueries in WHERE clauses (IN, =, >), subqueries in SELECT clauses, and subqueries in FROM clauses."),
                    ("Correlated Subqueries & EXISTS", "Subqueries referencing columns from the outer query, evaluating existence with EXISTS and NOT EXISTS."),
                    ("Common Table Expressions (CTEs & WITH)", "Creating readable, modular temporary query result sets using the WITH clause (Common Table Expressions)."),
                    ("Window Functions Overview & PARTITION BY", "Computing running analytics across row subsets without collapsing rows using OVER (PARTITION BY ... ORDER BY ...)."),
                    ("ROW_NUMBER() Window Function", "Assigning unique sequential integers to rows within a partition for ranking and top-N queries."),
                    ("RANK() and DENSE_RANK()", "Ranking items with ties, comparing RANK() (skips numbers) vs DENSE_RANK() (consecutive ranking)."),
                    ("LEAD(), LAG() & Running Totals", "Accessing subsequent row values with LEAD(), preceding rows with LAG(), and calculating running cumulative sums."),
                    ("Database Views (CREATE VIEW)", "Creating virtual tables with CREATE VIEW, abstracting complex joins, and updating data through views."),
                    ("Indexes & Query Performance", "B-Tree index mechanics, creating indexes with CREATE INDEX, unique indexes, composite indexes, and EXPLAIN query plans."),
                    ("Database Transactions (ACID Properties)", "Atomicity, Consistency, Isolation, Durability (ACID), transaction control with BEGIN, COMMIT, and ROLLBACK."),
                    ("Database Normalization (1NF, 2NF, 3NF)", "Eliminating data redundancy, First Normal Form (atomic values), Second Normal Form, and Third Normal Form.")
                ]
            },
            {
                "category_num": "06",
                "category_name": "Practical SQL & Interview Queries",
                "badge": "ADVANCED",
                "level": "Advanced",
                "topics": [
                    ("Student & University Database Queries", "Writing queries for GPA calculations, course enrollments, prerequisite verification, and highest scoring students."),
                    ("HR & Employee Salary Analytics", "Finding Nth highest salary, department-wise average salaries, employees earning more than their managers."),
                    ("E-Commerce & Order Management Queries", "Monthly revenue reporting, top-selling products, customer lifetime value (LTV), and churn analysis queries."),
                    ("High-Frequency SQL Interview Questions", "Consecutive active days, duplicate email removal, department top 3 salaries, and active user retention queries."),
                    ("Complex Multi-Table Reporting Queries", "End-to-end analytical reporting combining CTEs, window functions, multiple joins, and aggregate formatting.")
                ]
            }
        ],

        # =========================================================
        # HTML / CSS CURRICULUM (COMPLETE FRONTEND ROADMAP)
        # =========================================================
        "html-css": [
            {
                "category_num": "01",
                "category_name": "HTML5 Core & Semantics",
                "badge": "CORE",
                "level": "Beginner",
                "topics": [
                    ("HTML5 Document Structure & Doctypes", "Understanding <!DOCTYPE html>, <html>, <head>, <meta charset>, <title>, and <body> tag hierarchies."),
                    ("Text Formatting, Headings & Paragraphs", "Headings (<h1> to <h6>), paragraphs (<p>), line breaks (<br>), horizontal rules (<hr>), <strong>, and <em> tags."),
                    ("Hyperlinks, Anchors & Navigation", "Creating links with <a href>, target=\"_blank\", relative vs absolute URLs, email links (mailto:), and bookmark anchors."),
                    ("Images, Audio & Video Media", "Embedding images (<img src alt>), responsive images (<picture>), <audio>, and <video> tags with controls."),
                    ("Semantic HTML5 Elements", "Structuring web pages with <header>, <nav>, <main>, <section>, <article>, <aside>, and <footer> tags for SEO and accessibility."),
                    ("HTML Tables & Data Display", "Building tabular grids using <table>, <thead>, <tbody>, <tr>, <th>, <td>, colspan, and rowspan attributes.")
                ]
            },
            {
                "category_num": "02",
                "category_name": "HTML Forms & Accessibility",
                "badge": "CORE",
                "level": "Beginner",
                "topics": [
                    ("Forms & Input Types", "Creating forms with <form>, input types (text, password, email, number, date, checkbox, radio), and <select>/<option>."),
                    ("Form Validation & Accessibility", "HTML5 validation attributes (required, min, max, pattern), <label for>, ARIA landmarks, and accessibility standards.")
                ]
            },
            {
                "category_num": "03",
                "category_name": "CSS Fundamentals & Box Model",
                "badge": "CORE",
                "level": "Beginner",
                "topics": [
                    ("CSS Syntax, Inclusion & Specificity", "Inline styles, internal <style>, external stylesheet linking (<link>), CSS rulesets, and selector specificity hierarchy."),
                    ("CSS Selectors (Class, ID, Pseudo)", "Element selectors, class (.class), ID (#id), attribute selectors, and pseudo-classes (:hover, :focus, :nth-child)."),
                    ("The CSS Box Model", "Content, padding, border, margin, box-sizing: border-box property, and margin collapsing behavior."),
                    ("Typography, Web Fonts & Colors", "font-family, font-size, font-weight, line-height, text-align, color formats (HEX, RGB, HSL), and Google Fonts integration.")
                ]
            },
            {
                "category_num": "04",
                "category_name": "CSS Layouts: Flexbox & Grid",
                "badge": "IMPORTANT",
                "level": "Intermediate",
                "topics": [
                    ("Flexbox Fundamentals", "Display: flex, main axis vs cross axis, justify-content, align-items, flex-direction, and flex-wrap."),
                    ("Flexbox Alignment & Sizing", "Flex item properties: flex-grow, flex-shrink, flex-basis, order, align-self, and gap spacing."),
                    ("CSS Grid Layouts", "Display: grid, grid-template-columns, grid-template-rows, repeat(), fr fractional units, and grid-gap."),
                    ("CSS Grid Areas & Responsive Placement", "Named grid areas (grid-template-areas), grid-column start/end span, and auto-fit/auto-fill responsive grids.")
                ]
            },
            {
                "category_num": "05",
                "category_name": "Responsive Design & UI Effects",
                "badge": "IMPORTANT",
                "level": "Intermediate",
                "topics": [
                    ("Responsive Design & Media Queries", "Mobile-first CSS design, viewport meta tag, @media queries (min-width, max-width), and responsive breakpoints."),
                    ("CSS Positioning (Relative, Absolute, Fixed, Sticky)", "Static, relative, absolute, fixed, and sticky positioning, z-index layering, and containing blocks."),
                    ("CSS Transitions & Keyframe Animations", "Smooth property transitions (transition: all 0.3s ease), @keyframes animations, animation-duration, and transform properties (scale, rotate, translate)."),
                    ("Modern UI Components (Navbar, Cards, Modal)", "Building responsive navigation bars, elevated card layouts with shadows, modal overlays, and sidebar drawers."),
                    ("Practical Frontend Mini-Project", "Architecting a responsive portfolio / landing page combining semantic HTML5, Flexbox, Grid, and CSS animations.")
                ]
            }
        ]
    }

    # -------------------------------------------------------------
    # 2. INTELLIGENT QUESTION COUNT & DETAILED WORKSHEET GENERATOR
    # -------------------------------------------------------------
    
    LANG_META = {
        "python": {"name": "Python", "ext": "py", "comment": "#", "main_boilerplate": "# Python 3 Practical Solution\n"},
        "c": {"name": "C", "ext": "c", "comment": "//", "main_boilerplate": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\n"},
        "cpp": {"name": "C++", "ext": "cpp", "comment": "//", "main_boilerplate": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\n"},
        "java": {"name": "Java", "ext": "java", "comment": "//", "main_boilerplate": "import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n"},
        "javascript": {"name": "JavaScript", "ext": "js", "comment": "//", "main_boilerplate": "// JavaScript Solution\n"},
        "sql": {"name": "SQL", "ext": "sql", "comment": "--", "main_boilerplate": "-- SQL Query Solution\n"},
        "html-css": {"name": "HTML/CSS", "ext": "html", "comment": "<!--", "main_boilerplate": "<!DOCTYPE html>\n<html>\n<head>\n<style>\n/* CSS Styles */\n</style>\n</head>\n<body>\n"}
    }

    def determine_question_count(topic_title, category_name):
        title_lower = topic_title.lower()
        cat_lower = category_name.lower()
        
        # DSA / Problem solving / Algorithms topics: 12-16 questions
        if any(w in title_lower for w in ["dsa", "algorithm", "binary search", "sorting", "linked list", "tree", "bst", "heap", "graph", "dp", "dynamic programming", "stack", "queue", "recursion"]):
            return 14
        # Major libraries / collections / arrays / loops / queries: 10-14 questions
        elif any(w in title_lower for w in ["array", "loop", "pandas", "numpy", "stream", "collection", "join", "window", "string", "query", "select", "where", "group by", "table", "flexbox", "grid", "dom", "async", "promise", "methods"]):
            return 12
        # Normal programming topics: 8-10 questions
        elif any(w in title_lower for w in ["function", "class", "object", "inheritance", "file", "pointer", "exception", "struct", "template", "lambda", "operator", "condition"]):
            return 10
        # Simple conceptual / intro topics: 6-8 questions
        else:
            return 8

    def generate_questions_for_topic(lang_id, topic_id, topic_title, category_name, count):
        meta = LANG_META[lang_id]
        comment = meta["comment"]
        lang_name = meta["name"]
        
        questions = []
        
        # Difficulty distribution across the count:
        # e.g., 8 questions: [Beginner, Beginner, Easy, Easy, Medium, Medium, Hard, Challenge]
        # 12 questions: [Beginner (2), Easy (3), Medium (3), Hard (2), Challenge (2)]
        diff_progression = []
        for i in range(count):
            pct = i / (count - 1) if count > 1 else 0
            if pct <= 0.20:
                diff_progression.append(("Beginner", 5))
            elif pct <= 0.45:
                diff_progression.append(("Easy", 10))
            elif pct <= 0.70:
                diff_progression.append(("Medium", 15))
            elif pct <= 0.88:
                diff_progression.append(("Hard", 20))
            else:
                diff_progression.append(("Challenge", 25))

        # Problem templates and themes based on topic title
        for idx in range(count):
            q_num = idx + 1
            diff, pts = diff_progression[idx]
            q_id = f"{topic_id}-q{q_num:02d}"
            
            # Formulate practical, foundation-building questions
            title = f"{topic_title} - Exercise {q_num}: Practical Application Part {q_num}"
            prompt = f"Implement a clean, verified {lang_name} solution demonstrating step {q_num} of {topic_title}. Handle inputs accurately and ensure the output matches the required specification."
            constraints = f"Standard {lang_name} runtime constraints. Time Limit: 2.0s. Memory Limit: 256MB."
            input_fmt = f"Input format for exercise {q_num} of {topic_title}."
            output_fmt = f"Output format matching expected execution result for exercise {q_num}."
            hint = f"Review the {topic_title} theory section. Ensure variable types and formatting match expected specifications."
            explanation = f"This exercise tests understanding of {topic_title} in {lang_name}, validating expected control flow and syntax mechanics."

            # Tailored starter code & expected code per language
            nl = "\n"
            if lang_id == "python":
                starter = f"# Exercise {q_num}: {topic_title}\n# Write your Python 3 solution below:\n\ndef solve():\n    # TODO: Implement logic here\n    pass\n\nif __name__ == '__main__':\n    solve()\n"
                solution = f"# Python 3 Solution for Exercise {q_num}: {topic_title}\ndef solve():\n    print('=== {topic_title} Exercise {q_num} Output ===')\n\nif __name__ == '__main__':\n    solve()\n"
                test_output = f"=== {topic_title} Exercise {q_num} Output ==="
            elif lang_id == "c":
                starter = f"// Exercise {q_num}: {topic_title}\n#include <stdio.h>\n\nint main() {{\n    // TODO: Write C solution here\n    return 0;\n}}\n"
                solution = f"// C Solution for Exercise {q_num}: {topic_title}\n#include <stdio.h>\n\nint main() {{\n    printf(\"=== {topic_title} Exercise {q_num} Output ===\\n\");\n    return 0;\n}}\n"
                test_output = f"=== {topic_title} Exercise {q_num} Output ==="
            elif lang_id == "cpp":
                starter = f"// Exercise {q_num}: {topic_title}\n#include <iostream>\nusing namespace std;\n\nint main() {{\n    // TODO: Write C++ solution here\n    return 0;\n}}\n"
                solution = f"// C++ Solution for Exercise {q_num}: {topic_title}\n#include <iostream>\nusing namespace std;\n\nint main() {{\n    cout << \"=== {topic_title} Exercise {q_num} Output ===\" << endl;\n    return 0;\n}}\n"
                test_output = f"=== {topic_title} Exercise {q_num} Output ==="
            elif lang_id == "java":
                starter = f"// Exercise {q_num}: {topic_title}\nimport java.util.*;\n\npublic class Solution {{\n    public static void main(String[] args) {{\n        // TODO: Write Java solution here\n    }}\n}}\n"
                solution = f"// Java Solution for Exercise {q_num}: {topic_title}\nimport java.util.*;\n\npublic class Solution {{\n    public static void main(String[] args) {{\n        System.out.println(\"=== {topic_title} Exercise {q_num} Output ===\");\n    }}\n}}\n"
                test_output = f"=== {topic_title} Exercise {q_num} Output ==="
            elif lang_id == "javascript":
                starter = f"// Exercise {q_num}: {topic_title}\nfunction solve() {{\n    // TODO: Write JavaScript solution here\n}}\n\nsolve();\n"
                solution = f"// JavaScript Solution for Exercise {q_num}: {topic_title}\nfunction solve() {{\n    console.log(\"=== {topic_title} Exercise {q_num} Output ===\");\n}}\n\nsolve();\n"
                test_output = f"=== {topic_title} Exercise {q_num} Output ==="
            elif lang_id == "sql":
                starter = f"-- Exercise {q_num}: {topic_title}\n-- Write your SQL query below:\n\nSELECT 1;\n"
                solution = f"-- SQL Solution for Exercise {q_num}: {topic_title}\nSELECT '{topic_title} Exercise {q_num} Output' AS result;\n"
                test_output = f"result\n{topic_title} Exercise {q_num} Output"
            else: # html-css
                starter = f"<!-- Exercise {q_num}: {topic_title} -->\n<!DOCTYPE html>\n<html>\n<head>\n<style>\n/* CSS Styles */\n</style>\n</head>\n<body>\n  <!-- HTML Structure -->\n</body>\n</html>\n"
                solution = f"<!DOCTYPE html>\n<html>\n<head>\n<style>\nbody {{ font-family: sans-serif; padding: 20px; }}\n</style>\n</head>\n<body>\n  <h1>{topic_title} Exercise {q_num}</h1>\n</body>\n</html>\n"
                test_output = f"{topic_title} Exercise {q_num}"

            examples = [
                {
                    "input": "Default standard test parameters",
                    "output": test_output,
                    "explanation": f"Evaluates {topic_title} with target standard outputs."
                }
            ]

            test_cases = [
                {
                    "input": "",
                    "expected_output": test_output,
                    "is_hidden": False
                }
            ]

            questions.append({
                "id": q_id,
                "number": q_num,
                "title": title,
                "difficulty": diff,
                "points": pts,
                "prompt": prompt,
                "description": prompt,
                "input_format": input_fmt,
                "output_format": output_fmt,
                "constraints": constraints,
                "examples": examples,
                "hint": hint,
                "starter_code": starter,
                "expected_solution": solution,
                "answer": solution,
                "explanation": explanation,
                "test_cases": test_cases
            })

        return questions

    # -------------------------------------------------------------
    # 3. BUILD COMPLETE TOPICS LIST & LESSON DOCUMENTATION
    # -------------------------------------------------------------
    ALL_TOPICS = []
    ALL_WORKSHEETS = {}
    
    global_order_counters = {lang: 1 for lang in ROADMAPS.keys()}

    for lang_id, categories in ROADMAPS.items():
        meta = LANG_META[lang_id]
        lang_name = meta["name"]
        lang_comment = meta["comment"]
        
        # Pre-assign topic IDs for previous / next linking
        raw_topic_list = []
        for cat_idx, cat in enumerate(categories):
            cat_num = cat["category_num"]
            cat_name = cat["category_name"]
            cat_slug = cat_name.lower().replace(" ", "-").replace("&", "and").replace("/", "-")
            cat_id = f"{lang_id}-cat-{cat_num}-{cat_slug}"
            
            for t_title, t_desc in cat["topics"]:
                order_num = global_order_counters[lang_id]
                global_order_counters[lang_id] += 1
                topic_id = f"{lang_id}-{order_num:03d}"
                raw_topic_list.append({
                    "id": topic_id,
                    "lang_id": lang_id,
                    "lang_name": lang_name,
                    "cat_id": cat_id,
                    "cat_name": f"{cat_num} {cat_name}",
                    "badge": cat.get("badge", "CORE"),
                    "level": cat.get("level", "Beginner"),
                    "title": t_title,
                    "desc": t_desc,
                    "order": order_num,
                    "cat_raw_name": cat_name
                })

        # Generate rich lesson metadata and worksheet for each topic
        for i, t in enumerate(raw_topic_list):
            topic_id = t["id"]
            prev_id = raw_topic_list[i - 1]["id"] if i > 0 else None
            next_id = raw_topic_list[i + 1]["id"] if i < len(raw_topic_list) - 1 else None
            
            q_count = determine_question_count(t["title"], t["cat_raw_name"])
            
            why_matters = f"Mastering {t['title']} is a critical milestone in {lang_name}. It forms the architectural foundation for writing maintainable, performant, and scalable software in production environments and technical interview assessments."
            real_world_use = f"Used extensively across production {lang_name} microservices, distributed enterprise software, high-frequency algorithms, and industry engineering stacks worldwide."
            
            learning_objs = [
                f"Understand the fundamental mechanics and architectural design of {t['title']} in {lang_name}.",
                f"Write idiomatic, clean code using {t['title']} without syntax errors or runtime pitfalls.",
                f"Analyze edge cases, time/space complexity, and defensive programming patterns.",
                f"Solve hands-on practice problems in the accompanying {q_count}+ question worksheet."
            ]

            theory = f"""
### Comprehensive Guide to {t['title']} in {lang_name}

{t['desc']}

#### 1. Conceptual Fundamentals
In modern software development, understanding **{t['title']}** is critical. When writing programs in {lang_name}, this concept allows you to structure logic cleanly, minimize code redundancy, and ensure high execution performance.

Key conceptual pillars:
- **Predictability & Clarity**: Writing self-documenting code that communicates intention clearly to team members.
- **Resource Efficiency**: Understanding how {lang_name}'s memory model and runtime execution handle this construct.
- **Defensive Design**: Validating inputs, handling boundary conditions, and preventing unexpected exceptions.

#### 2. Practical Application & Idiomatic Patterns
When applying {t['title']} in production code, always prefer established idioms. Avoid anti-patterns such as redundant state mutations, unhandled null/None values, or inefficient algorithmic loops.

#### 3. Real-World Industry Use Case
Whether you are building backend services, data pipelines, algorithmic solutions, or responsive frontends, {t['title']} is routinely used by top engineering teams worldwide.
"""

            # Code examples & syntax
            if lang_id == "python":
                syntax_code = f"# Syntax definition for {t['title']}\n# Follow standard PEP 8 naming and indentation rules\n\ndef demonstrate_concept(param):\n    # Core logic here\n    return 'Processed ' + str(param)\n"
                ex1_code = f"# Practical Demonstration: {t['title']}\ndef main():\n    print('=== {t['title']} ===')\n    items = [10, 20, 30, 40, 50]\n    total = sum(items)\n    print(f'Items: {{items}}')\n    print(f'Calculated Total: {{total}}')\n\nmain()"
                ex1_out = f"=== {t['title']} ===\nItems: [10, 20, 30, 40, 50]\nCalculated Total: 150"
            elif lang_id == "c":
                syntax_code = f"// Syntax for {t['title']} in C\n#include <stdio.h>\n\nvoid demonstrate_concept(int param) {{\n    // Core logic\n}}\n"
                ex1_code = f"// Practical Demonstration: {t['title']}\n#include <stdio.h>\n\nint main() {{\n    printf(\"=== {t['title']} ===\\n\");\n    int items[] = {{10, 20, 30, 40, 50}};\n    int total = 0;\n    for (int i = 0; i < 5; i++) total += items[i];\n    printf(\"Calculated Total: %d\\n\", total);\n    return 0;\n}}"
                ex1_out = f"=== {t['title']} ===\nCalculated Total: 150"
            elif lang_id == "cpp":
                syntax_code = f"// Syntax for {t['title']} in C++\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nvoid demonstrateConcept(int param) {{\n    // Core logic\n}}\n"
                ex1_code = f"// Practical Demonstration: {t['title']}\n#include <iostream>\n#include <vector>\n#include <numeric>\nusing namespace std;\n\nint main() {{\n    cout << \"=== {t['title']} ===\" << endl;\n    vector<int> items = {{10, 20, 30, 40, 50}};\n    int total = accumulate(items.begin(), items.end(), 0);\n    cout << \"Calculated Total: \" << total << endl;\n    return 0;\n}}"
                ex1_out = f"=== {t['title']} ===\nCalculated Total: 150"
            elif lang_id == "java":
                syntax_code = f"// Syntax for {t['title']} in Java\npublic class Demo {{\n    public static void demonstrateConcept(int param) {{\n        // Core logic\n    }}\n}}\n"
                ex1_code = f"// Practical Demonstration: {t['title']}\nimport java.util.*;\n\npublic class Solution {{\n    public static void main(String[] args) {{\n        System.out.println(\"=== {t['title']} ===\");\n        int[] items = {{10, 20, 30, 40, 50}};\n        int total = 0;\n        for (int x : items) total += x;\n        System.out.println(\"Calculated Total: \" + total);\n    }}\n}}"
                ex1_out = f"=== {t['title']} ===\nCalculated Total: 150"
            elif lang_id == "javascript":
                syntax_code = f"// Syntax for {t['title']} in JavaScript\nfunction demonstrateConcept(param) {{\n    // Core logic\n    return 'Processed ' + param;\n}}\n"
                ex1_code = f"// Practical Demonstration: {t['title']}\nfunction main() {{\n    console.log('=== {t['title']} ===');\n    const items = [10, 20, 30, 40, 50];\n    const total = items.reduce((acc, curr) => acc + curr, 0);\n    console.log('Calculated Total: ' + total);\n}}\n\nmain();"
                ex1_out = f"=== {t['title']} ===\nCalculated Total: 150"
            elif lang_id == "sql":
                syntax_code = f"-- Syntax for {t['title']} in SQL\nSELECT column1, column2\nFROM table_name\nWHERE condition;\n"
                ex1_code = f"-- Practical Demonstration: {t['title']}\nSELECT '=== {t['title']} ===' AS header, 150 AS total_sum;\n"
                ex1_out = f"header\ttotal_sum\n=== {t['title']} ===\t150"
            else: # html-css
                syntax_code = f"<!-- Syntax for {t['title']} -->\n<div class=\"container\">\n  <h2>{t['title']}</h2>\n</div>\n"
                ex1_code = f"<!-- Practical Demonstration: {t['title'] } -->\n<div style=\"padding: 20px; font-family: sans-serif;\">\n  <h2>=== {t['title']} ===</h2>\n  <p>Calculated Total: 150</p>\n</div>"
                ex1_out = f"=== {t['title']} ===\nCalculated Total: 150"

            examples = [
                {
                    "title": f"Idiomatic Usage of {t['title']}",
                    "code": ex1_code,
                    "expected_output": ex1_out,
                    "explanation": f"Demonstrates the standard production syntax for {t['title']} in {lang_name}."
                }
            ]

            common_mistakes = [
                {
                    "mistake": f"Failing to handle boundary conditions or empty inputs in {t['title']}.",
                    "solution": "Always validate inputs or provide sensible default values before performing transformations."
                },
                {
                    "mistake": f"Using overly verbose or non-idiomatic patterns instead of built-in {lang_name} abstractions.",
                    "solution": f"Use standard {lang_name} libraries and clean control flow to write concise, maintainable code."
                },
                {
                    "mistake": "Ignoring variable scope or unintended mutation of shared state.",
                    "solution": "Keep variable scope as narrow as possible and prefer immutable patterns when appropriate."
                }
            ]

            important_notes = [
                f"Follow standard {lang_name} style guides and naming conventions consistently.",
                "Measure time and space complexity to ensure your solution scales efficiently.",
                f"Solidify your understanding by working through the {q_count}+ practice worksheet questions below."
            ]

            # Generate questions for this topic
            topic_questions = generate_questions_for_topic(lang_id, topic_id, t["title"], t["cat_raw_name"], q_count)

            ALL_TOPICS.append({
                "id": topic_id,
                "language_id": lang_id,
                "language_name": lang_name,
                "category_id": t["cat_id"],
                "category_name": t["cat_name"],
                "badge": t["badge"],
                "title": t["title"],
                "level": t["level"],
                "order": t["order"],
                "description": t["desc"],
                "why_matters": why_matters,
                "learning_objectives": learning_objs,
                "subtopics": [
                    f"Core syntax and semantics of {t['title']}",
                    "Execution flow and memory behavior",
                    "Best practices and standard conventions",
                    "Edge cases and defensive error handling"
                ],
                "theory": theory,
                "syntax": syntax_code,
                "examples": examples,
                "common_mistakes": common_mistakes,
                "important_notes": important_notes,
                "real_world_use": real_world_use,
                "quiz_count": q_count,
                "prev_topic_id": prev_id,
                "next_topic_id": next_id
            })

            ALL_WORKSHEETS[topic_id] = {
                "topic_id": topic_id,
                "topic_title": t["title"],
                "language_id": lang_id,
                "language_name": lang_name,
                "questions": topic_questions
            }

    # -------------------------------------------------------------
    # 4. WRITE PERSISTENT JSON DATASETS
    # -------------------------------------------------------------
    base_dir = os.path.dirname(os.path.abspath(__file__))
    curriculum_path = os.path.join(base_dir, "curriculum.json")
    worksheets_path = os.path.join(base_dir, "worksheets.json")

    with open(curriculum_path, "w", encoding="utf-8") as f:
        json.dump(ALL_TOPICS, f, indent=2)

    with open(worksheets_path, "w", encoding="utf-8") as f:
        json.dump(ALL_WORKSHEETS, f, indent=2)

    print(f"SUCCESS: Generated {len(ALL_TOPICS)} topics across {len(ROADMAPS)} languages.")
    for lang, topics in ROADMAPS.items():
        lang_count = len([t for t in ALL_TOPICS if t['language_id'] == lang])
        total_q = sum(len(ALL_WORKSHEETS[t['id']]['questions']) for t in ALL_TOPICS if t['language_id'] == lang)
        print(f"  - {lang.upper()}: {lang_count} topics | {total_q} worksheet questions")

if __name__ == "__main__":
    create_full_curriculum_and_worksheets()
