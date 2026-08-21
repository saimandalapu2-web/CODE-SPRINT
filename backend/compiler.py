import sys
import time
import subprocess
import tempfile
import os
import sqlite3
import json
import shutil
from typing import Dict, Any, Tuple, List, Optional

SQL_SAMPLE_DB = """
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    course TEXT NOT NULL,
    department TEXT NOT NULL,
    marks REAL NOT NULL,
    gpa REAL NOT NULL,
    semester INTEGER NOT NULL DEFAULT 4,
    city TEXT NOT NULL DEFAULT 'Seattle'
);

INSERT OR IGNORE INTO students (id, name, age, course, department, marks, gpa, semester, city) VALUES
(1, 'Alex Rivera', 20, 'Computer Science', 'Computer Science', 88.5, 3.8, 4, 'Seattle'),
(2, 'Priya Sharma', 22, 'Data Science', 'Data Science', 94.0, 3.95, 6, 'San Francisco'),
(3, 'Liam Chen', 21, 'Software Engineering', 'Computer Science', 76.5, 3.4, 5, 'Austin'),
(4, 'Sofia Rodriguez', 19, 'Computer Science', 'Computer Science', 91.0, 3.85, 2, 'Boston'),
(5, 'Marcus Johnson', 23, 'Cybersecurity', 'Information Security', 82.0, 3.6, 7, 'Chicago'),
(6, 'Elena Rostova', 20, 'Artificial Intelligence', 'Data Science', 95.5, 4.0, 4, 'New York'),
(7, 'David Kim', 21, 'Data Science', 'Data Science', 69.0, 3.1, 5, 'Seattle'),
(8, 'Amina Yusuf', 22, 'Software Engineering', 'Computer Science', 85.0, 3.7, 6, 'San Jose');

CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    department TEXT NOT NULL,
    salary REAL NOT NULL,
    hire_date TEXT NOT NULL
);

INSERT OR IGNORE INTO employees (id, first_name, last_name, department, salary, hire_date) VALUES
(101, 'Alice', 'Morgan', 'Engineering', 95000, '2021-03-15'),
(102, 'Bob', 'Smith', 'Marketing', 68000, '2020-07-22'),
(103, 'Carol', 'Danvers', 'Engineering', 115000, '2019-01-10'),
(104, 'Daniel', 'Lee', 'Finance', 82000, '2022-11-01'),
(105, 'Eva', 'Green', 'Engineering', 99000, '2021-09-18');
"""

def execute_python(code: str, stdin_data: str = "", timeout: float = 3.5) -> Tuple[bool, str, str, float]:
    start_time = time.time()
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
        f.write(code)
        temp_file = f.name

    try:
        proc = subprocess.run(
            [sys.executable, "-I", temp_file],
            input=stdin_data,
            capture_output=True,
            text=True,
            timeout=timeout
        )
        exec_time = (time.time() - start_time) * 1000
        output = proc.stdout
        error = proc.stderr
        success = (proc.returncode == 0)
        if not success and not error:
            error = f"Process exited with error code {proc.returncode}"
        return success, output, error, exec_time
    except subprocess.TimeoutExpired:
        exec_time = (time.time() - start_time) * 1000
        return False, "", f"Execution Timed Out (Max {timeout}s allowed). Check for infinite loops or blocking input.", exec_time
    except Exception as e:
        exec_time = (time.time() - start_time) * 1000
        return False, "", str(e), exec_time
    finally:
        if os.path.exists(temp_file):
            try:
                os.remove(temp_file)
            except Exception:
                pass

def execute_c(code: str, stdin_data: str = "", timeout: float = 3.5) -> Tuple[bool, str, str, float]:
    start_time = time.time()
    gcc_path = shutil.which("gcc")
    if not gcc_path:
        return False, "", "GCC compiler is not installed on this system.", 0.0

    temp_dir = tempfile.mkdtemp(prefix="cs_c_")
    src_file = os.path.join(temp_dir, "main.c")
    bin_file = os.path.join(temp_dir, "main.out")

    try:
        with open(src_file, "w") as f:
            f.write(code)

        compile_proc = subprocess.run(
            [gcc_path, "-O2", src_file, "-o", bin_file, "-lm"],
            capture_output=True,
            text=True,
            timeout=5.0
        )

        if compile_proc.returncode != 0:
            exec_time = (time.time() - start_time) * 1000
            return False, "", f"Compilation Error:\n{compile_proc.stderr}", exec_time

        run_proc = subprocess.run(
            [bin_file],
            input=stdin_data,
            capture_output=True,
            text=True,
            timeout=timeout
        )

        exec_time = (time.time() - start_time) * 1000
        success = (run_proc.returncode == 0)
        output = run_proc.stdout
        error = run_proc.stderr
        if not success and not error:
            error = f"Process exited with code {run_proc.returncode}"
        return success, output, error, exec_time

    except subprocess.TimeoutExpired:
        exec_time = (time.time() - start_time) * 1000
        return False, "", f"Execution Timed Out (Max {timeout}s). Check for infinite loops.", exec_time
    except Exception as e:
        exec_time = (time.time() - start_time) * 1000
        return False, "", str(e), exec_time
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)

def execute_cpp(code: str, stdin_data: str = "", timeout: float = 3.5) -> Tuple[bool, str, str, float]:
    start_time = time.time()
    gpp_path = shutil.which("g++")
    if not gpp_path:
        return False, "", "G++ compiler is not installed on this system.", 0.0

    temp_dir = tempfile.mkdtemp(prefix="cs_cpp_")
    src_file = os.path.join(temp_dir, "main.cpp")
    bin_file = os.path.join(temp_dir, "main.out")

    try:
        with open(src_file, "w") as f:
            f.write(code)

        compile_proc = subprocess.run(
            [gpp_path, "-std=c++17", "-O2", src_file, "-o", bin_file, "-lm"],
            capture_output=True,
            text=True,
            timeout=5.0
        )

        if compile_proc.returncode != 0:
            exec_time = (time.time() - start_time) * 1000
            return False, "", f"Compilation Error:\n{compile_proc.stderr}", exec_time

        run_proc = subprocess.run(
            [bin_file],
            input=stdin_data,
            capture_output=True,
            text=True,
            timeout=timeout
        )

        exec_time = (time.time() - start_time) * 1000
        success = (run_proc.returncode == 0)
        output = run_proc.stdout
        error = run_proc.stderr
        if not success and not error:
            error = f"Process exited with code {run_proc.returncode}"
        return success, output, error, exec_time

    except subprocess.TimeoutExpired:
        exec_time = (time.time() - start_time) * 1000
        return False, "", f"Execution Timed Out (Max {timeout}s). Check for infinite loops.", exec_time
    except Exception as e:
        exec_time = (time.time() - start_time) * 1000
        return False, "", str(e), exec_time
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)

def execute_java(code: str, stdin_data: str = "", timeout: float = 4.0) -> Tuple[bool, str, str, float]:
    start_time = time.time()
    javac_path = shutil.which("javac")
    java_path = shutil.which("java")

    if not javac_path or not java_path:
        return False, "", "Java Development Kit (javac/java) is currently initializing or not found in system path.", 0.0

    temp_dir = tempfile.mkdtemp(prefix="cs_java_")
    
    # Identify class name or default to Main
    class_name = "Main"
    import re
    m = re.search(r"public\s+class\s+([A-Za-z0-9_]+)", code)
    if m:
        class_name = m.group(1)

    src_file = os.path.join(temp_dir, f"{class_name}.java")

    try:
        with open(src_file, "w") as f:
            f.write(code)

        compile_proc = subprocess.run(
            [javac_path, src_file],
            capture_output=True,
            text=True,
            timeout=6.0
        )

        if compile_proc.returncode != 0:
            exec_time = (time.time() - start_time) * 1000
            return False, "", f"Java Compilation Error:\n{compile_proc.stderr}", exec_time

        run_proc = subprocess.run(
            [java_path, "-cp", temp_dir, class_name],
            input=stdin_data,
            capture_output=True,
            text=True,
            timeout=timeout
        )

        exec_time = (time.time() - start_time) * 1000
        success = (run_proc.returncode == 0)
        output = run_proc.stdout
        error = run_proc.stderr
        if not success and not error:
            error = f"Java runtime exited with code {run_proc.returncode}"
        return success, output, error, exec_time

    except subprocess.TimeoutExpired:
        exec_time = (time.time() - start_time) * 1000
        return False, "", f"Execution Timed Out (Max {timeout}s). Check for infinite loops.", exec_time
    except Exception as e:
        exec_time = (time.time() - start_time) * 1000
        return False, "", str(e), exec_time
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)

def execute_javascript(code: str, stdin_data: str = "", timeout: float = 3.5) -> Tuple[bool, str, str, float]:
    start_time = time.time()
    node_path = shutil.which("node")
    if not node_path:
        return False, "", "Node.js environment not found.", 0.0

    with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False) as f:
        f.write(code)
        temp_file = f.name

    try:
        proc = subprocess.run(
            [node_path, temp_file],
            input=stdin_data,
            capture_output=True,
            text=True,
            timeout=timeout
        )
        exec_time = (time.time() - start_time) * 1000
        success = (proc.returncode == 0)
        return success, proc.stdout, proc.stderr, exec_time
    except subprocess.TimeoutExpired:
        exec_time = (time.time() - start_time) * 1000
        return False, "", f"Execution Timed Out (Max {timeout}s).", exec_time
    except Exception as e:
        exec_time = (time.time() - start_time) * 1000
        return False, "", str(e), exec_time
    finally:
        if os.path.exists(temp_file):
            try:
                os.remove(temp_file)
            except Exception:
                pass

def execute_sql(query: str, db_path: str = None) -> Tuple[bool, str, str, float]:
    start_time = time.time()
    try:
        conn = sqlite3.connect(":memory:" if not db_path else db_path)
        cursor = conn.cursor()
        cursor.executescript(SQL_SAMPLE_DB)
        conn.commit()

        statements = [s.strip() for s in query.strip().split(';') if s.strip()]
        if not statements:
            return True, "No SQL statements executed.", "", 0.0

        output_rows = []
        last_columns = []
        for stmt in statements:
            cursor.execute(stmt)
            if cursor.description:
                last_columns = [col[0] for col in cursor.description]
                rows = cursor.fetchall()
                output_rows = rows
            else:
                conn.commit()

        exec_time = (time.time() - start_time) * 1000
        conn.close()

        if last_columns:
            col_widths = [max(len(str(col)), max([len(str(row[i])) for row in output_rows], default=0)) for i, col in enumerate(last_columns)]
            header = " | ".join(str(col).ljust(col_widths[i]) for i, col in enumerate(last_columns))
            divider = "-+-".join("-" * col_widths[i] for i in range(len(last_columns)))
            
            row_lines = []
            for row in output_rows:
                row_lines.append(" | ".join(str(val).ljust(col_widths[i]) for i, val in enumerate(row)))
            
            result_str = f"{header}\n{divider}\n" + "\n".join(row_lines) + f"\n\n({len(output_rows)} row{'s' if len(output_rows) != 1 else ''} returned)"
            return True, result_str, "", exec_time
        else:
            return True, "Query executed successfully. Changes committed to database.", "", exec_time

    except Exception as e:
        exec_time = (time.time() - start_time) * 1000
        return False, "", f"SQL Error: {str(e)}", exec_time

def execute_code(language: str, code: str, stdin_data: str = "") -> Dict[str, Any]:
    lang = (language or "").lower().strip()
    
    if lang in ["python", "py", "python3"]:
        success, out, err, exec_time = execute_python(code, stdin_data)
        return {
            "success": success,
            "output": out,
            "error": err if not success else None,
            "execution_time_ms": round(exec_time, 2),
            "language": "Python",
            "native_supported": True
        }
    elif lang in ["c"]:
        success, out, err, exec_time = execute_c(code, stdin_data)
        return {
            "success": success,
            "output": out,
            "error": err if not success else None,
            "execution_time_ms": round(exec_time, 2),
            "language": "C",
            "native_supported": True
        }
    elif lang in ["cpp", "c++", "cplusplus"]:
        success, out, err, exec_time = execute_cpp(code, stdin_data)
        return {
            "success": success,
            "output": out,
            "error": err if not success else None,
            "execution_time_ms": round(exec_time, 2),
            "language": "C++",
            "native_supported": True
        }
    elif lang in ["java"]:
        success, out, err, exec_time = execute_java(code, stdin_data)
        return {
            "success": success,
            "output": out,
            "error": err if not success else None,
            "execution_time_ms": round(exec_time, 2),
            "language": "Java",
            "native_supported": True
        }
    elif lang in ["javascript", "js"]:
        success, out, err, exec_time = execute_javascript(code, stdin_data)
        return {
            "success": success,
            "output": out,
            "error": err if not success else None,
            "execution_time_ms": round(exec_time, 2),
            "language": "JavaScript",
            "native_supported": True
        }
    elif lang in ["sql", "sqlite"]:
        success, out, err, exec_time = execute_sql(code)
        return {
            "success": success,
            "output": out,
            "error": err if not success else None,
            "execution_time_ms": round(exec_time, 2),
            "language": "SQL",
            "native_supported": True
        }
    elif lang in ["html", "html/css", "css"]:
        return {
            "success": True,
            "output": "HTML/CSS renders directly in the frontend live preview sandbox.",
            "error": None,
            "execution_time_ms": 0.5,
            "language": "HTML/CSS",
            "native_supported": True
        }
    else:
        return {
            "success": False,
            "output": "",
            "error": f"Unsupported language: {language}",
            "execution_time_ms": 0.0,
            "language": language,
            "native_supported": False
        }

def evaluate_test_cases(language: str, code: str, test_cases: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Evaluates user code against test cases with status calculation (Passed, Failed, Error, Timeout)
    """
    results = []
    passed_count = 0
    total_count = len(test_cases)
    
    for idx, tc in enumerate(test_cases):
        inp = tc.get("input", "")
        expected = str(tc.get("expected_output", "")).strip()
        
        exec_res = execute_code(language, code, inp)
        actual_out = (exec_res.get("output") or "").strip()
        err = exec_res.get("error")
        
        is_timeout = err and "Timed Out" in err
        is_compile_err = err and "Compilation Error" in err
        
        passed = False
        status = "Failed"
        if is_timeout:
            status = "Timeout"
        elif is_compile_err:
            status = "Compilation Error"
        elif err:
            status = "Runtime Error"
        elif actual_out == expected or (expected in actual_out):
            passed = True
            passed_count += 1
            status = "Passed"
        else:
            status = "Failed"
            
        results.append({
            "test_case_index": idx + 1,
            "input": inp,
            "expected_output": expected,
            "actual_output": actual_out,
            "error": err,
            "passed": passed,
            "status": status,
            "hidden": tc.get("hidden", False)
        })
        
    overall_status = "Passed" if passed_count == total_count and total_count > 0 else (
        "Compilation Error" if any(r["status"] == "Compilation Error" for r in results) else (
            "Timeout" if any(r["status"] == "Timeout" for r in results) else (
                "Runtime Error" if any(r["status"] == "Runtime Error" for r in results) else "Failed"
            )
        )
    )
    
    return {
        "passed_count": passed_count,
        "total_count": total_count,
        "passed": (passed_count == total_count and total_count > 0),
        "overall_status": overall_status,
        "results": results
    }
