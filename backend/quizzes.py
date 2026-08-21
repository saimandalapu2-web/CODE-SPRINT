# Quiz Data and Assessment Engine for CodeLearn
from typing import Dict, Any, List, Optional
import random

QUIZZES_BY_TOPIC: Dict[str, List[Dict[str, Any]]] = {
    "py-001": [
        {
            "id": "py-001-q01",
            "topic_id": "py-001",
            "question": "Who created the Python programming language?",
            "code_snippet": None,
            "options": ["Guido van Rossum", "Dennis Ritchie", "James Gosling", "Bjarne Stroustrup"],
            "correct_index": 0,
            "explanation": "Guido van Rossum developed Python in 1991 at CWI in the Netherlands.",
            "points": 10
        },
        {
            "id": "py-001-q02",
            "topic_id": "py-001",
            "question": "What is the primary mechanism Python uses to define code block scope?",
            "code_snippet": None,
            "options": ["Curly braces { }", "Begin and End keywords", "Consistent whitespace and indentation", "Semicolons at the end of each line"],
            "correct_index": 2,
            "explanation": "Unlike C or Java which use { }, Python uses 4-space indentation to define blocks.",
            "points": 10
        },
        {
            "id": "py-001-q03",
            "topic_id": "py-001",
            "question": "What is the output of the following code?",
            "code_snippet": "print(10, 20, sep=' + ', end=' = 30\\n')",
            "options": ["10 20 = 30", "10 + 20 = 30", "10 + 20", "SyntaxError"],
            "correct_index": 1,
            "explanation": "The sep=' + ' replaces space between arguments, and end=' = 30\\n' finishes the line.",
            "points": 10
        },
        {
            "id": "py-001-q04",
            "topic_id": "py-001",
            "question": "Which statement about Python bytecode is correct?",
            "code_snippet": None,
            "options": [
                "Python does not produce bytecode at all",
                "CPython compiles source code into .pyc bytecode files executed by the PVM",
                "Bytecode is only used in C++ and Rust",
                "Bytecode can directly execute on raw CPU registers without an interpreter"
            ],
            "correct_index": 1,
            "explanation": "CPython converts .py to cached .pyc bytecode for faster loading and execution on the Python Virtual Machine.",
            "points": 10
        },
        {
            "id": "py-001-q05",
            "topic_id": "py-001",
            "question": "How are multi-line docstrings typically written in Python?",
            "code_snippet": None,
            "options": ["/* comment */", "-- comment --", "''' or \"\"\" triple quotes", "// comment //"],
            "correct_index": 2,
            "explanation": "Triple single (''') or triple double (\"\"\") quotes are used for multi-line docstrings.",
            "points": 10
        }
    ],

    "py-002": [
        {
            "id": "py-002-q01",
            "topic_id": "py-002",
            "question": "Which of the following is an illegal variable name in Python?",
            "code_snippet": None,
            "options": ["_score_total", "scoreTotal2", "2ndScore", "SCORE_TOTAL"],
            "correct_index": 2,
            "explanation": "Variable identifiers cannot begin with a number or digit in Python.",
            "points": 10
        },
        {
            "id": "py-002-q02",
            "topic_id": "py-002",
            "question": "What is printed by the following code snippet?",
            "code_snippet": "a = 5\nb = 10\na, b = b, a + b\nprint(a, b)",
            "options": ["10 15", "10 5", "5 15", "15 10"],
            "correct_index": 0,
            "explanation": "The right hand side evaluates first to (10, 5 + 10) = (10, 15). Then a becomes 10 and b becomes 15.",
            "points": 10
        },
        {
            "id": "py-002-q03",
            "topic_id": "py-002",
            "question": "What does Python's dynamic typing mean?",
            "code_snippet": None,
            "options": [
                "Variables can never change their values once defined",
                "Variable types are determined at runtime and do not require static declarations",
                "Variables must be declared in C before use in Python",
                "All variables are converted to strings automatically"
            ],
            "correct_index": 1,
            "explanation": "Dynamic typing means variables bind to objects of any type at runtime without explicit type declarations.",
            "points": 10
        },
        {
            "id": "py-002-q04",
            "topic_id": "py-002",
            "question": "What is the purpose of the built-in type() function?",
            "code_snippet": None,
            "options": [
                "To simulate keyboard typing",
                "To return the class/type of an object",
                "To convert text to lowercase",
                "To delete a variable from memory"
            ],
            "correct_index": 1,
            "explanation": "type(obj) returns the data type or class object of the given argument.",
            "points": 10
        },
        {
            "id": "py-002-q05",
            "topic_id": "py-002",
            "question": "What is printed by this code?",
            "code_snippet": "x = [1, 2]\ny = x\nx.append(3)\nprint(y)",
            "options": ["[1, 2]", "[1, 2, 3]", "[3]", "None"],
            "correct_index": 1,
            "explanation": "y references the exact same list object as x in memory. Mutating x mutates y as well.",
            "points": 10
        }
    ]
}

def generate_default_quiz(topic_id: str, topic_title: str) -> List[Dict[str, Any]]:
    """Generates standard deterministic quiz questions for a topic."""
    return [
        {
            "id": f"{topic_id}-q01",
            "topic_id": topic_id,
            "question": f"What is the key principle behind {topic_title}?",
            "code_snippet": None,
            "options": [
                f"Structuring code cleanly to leverage {topic_title} for robust execution",
                "Bypassing compiler validation entirely",
                "Preventing any user inputs",
                "Executing random instructions"
            ],
            "correct_index": 0,
            "explanation": f"Understanding {topic_title} enables developers to write predictable, maintainable software.",
            "points": 10
        },
        {
            "id": f"{topic_id}-q02",
            "topic_id": topic_id,
            "question": f"Which of the following is true regarding syntax in {topic_title}?",
            "code_snippet": None,
            "options": [
                "Keywords and syntax tokens must follow strict language specifications",
                "Syntax does not matter to compilers or interpreters",
                "Spaces are completely illegal in all programming code",
                "All lines must be under 3 characters"
            ],
            "correct_index": 0,
            "explanation": "Strict syntax allows the interpreter or compiler to generate unambiguous execution plans.",
            "points": 10
        },
        {
            "id": f"{topic_id}-q03",
            "topic_id": topic_id,
            "question": f"When debugging issues in {topic_title}, what is the first recommended step?",
            "code_snippet": None,
            "options": [
                "Delete the operating system",
                "Read the error traceback or compiler diagnostic message to identify the failure line",
                "Ignore all errors and run again",
                "Change random characters in the file"
            ],
            "correct_index": 1,
            "explanation": "Tracebacks and error logs pinpoint the exact file, line number, and error type.",
            "points": 10
        },
        {
            "id": f"{topic_id}-q04",
            "topic_id": topic_id,
            "question": f"Why is modularity important when applying {topic_title}?",
            "code_snippet": None,
            "options": [
                "It allows isolating logic into testable, maintainable, and reusable units",
                "It makes the program run 10,000 times slower",
                "It prevents code from ever being updated",
                "It requires more physical hard drives"
            ],
            "correct_index": 0,
            "explanation": "Modularity divides complex programs into manageable, reusable components.",
            "points": 10
        },
        {
            "id": f"{topic_id}-q05",
            "topic_id": topic_id,
            "question": f"What time complexity is ideal for standard search operations in hashed structures?",
            "code_snippet": None,
            "options": [
                "O(1) constant time on average",
                "O(n!) factorial time",
                "O(2^n) exponential time",
                "O(n^3) cubic time"
            ],
            "correct_index": 0,
            "explanation": "Hash tables provide average O(1) constant time lookups and insertions.",
            "points": 10
        }
    ]

def get_quiz_for_topic(topic_id: str, topic_title: str, language_id: str) -> Dict[str, Any]:
    """Retrieves full quiz dataset for a given topic."""
    questions = QUIZZES_BY_TOPIC.get(topic_id)
    if not questions:
        questions = generate_default_quiz(topic_id, topic_title)
        
    return {
        "topic_id": topic_id,
        "topic_title": topic_title,
        "language_id": language_id,
        "total_questions": len(questions),
        "pass_percentage": 70,
        "questions": questions
    }

def evaluate_quiz_submission(topic_id: str, answers: Dict[str, int]) -> Dict[str, Any]:
    """
    Scores quiz submissions deterministically against expected answers.
    Pass threshold: 70%.
    """
    q_list = QUIZZES_BY_TOPIC.get(topic_id) or generate_default_quiz(topic_id, "Topic")
    
    total_points = sum(q.get("points", 10) for q in q_list)
    earned_points = 0
    correct_count = 0
    total_count = len(q_list)
    detailed_results = []
    
    for q in q_list:
        qid = q["id"]
        correct_idx = q["correct_index"]
        user_choice = answers.get(qid)
        is_correct = (user_choice is not None and int(user_choice) == correct_idx)
        
        points_for_q = q.get("points", 10)
        if is_correct:
            earned_points += points_for_q
            correct_count += 1
            
        detailed_results.append({
            "question_id": qid,
            "question": q["question"],
            "user_choice_index": user_choice,
            "correct_choice_index": correct_idx,
            "is_correct": is_correct,
            "explanation": q["explanation"],
            "points": points_for_q if is_correct else 0
        })
        
    percentage = round((earned_points / total_points * 100) if total_points > 0 else 0, 1)
    passed = percentage >= 70.0
    
    return {
        "topic_id": topic_id,
        "score": earned_points,
        "total_points": total_points,
        "percentage": percentage,
        "passed": passed,
        "correct_count": correct_count,
        "total_count": total_count,
        "detailed_results": detailed_results
    }
