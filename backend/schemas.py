from typing import List, Optional, Dict, Any, Union
try:
    from pydantic import BaseModel, Field
except ImportError:
    class BaseModel:
        def __init__(self, **data):
            for k, v in data.items():
                setattr(self, k, v)
        def dict(self):
            return self.__dict__
        def model_dump(self):
            return self.__dict__
    def Field(default=None, **kwargs):
        return default

class LanguageInfo(BaseModel):
    id: str
    name: str
    icon: str
    description: str
    color: str
    total_topics: int
    levels: List[str]
    category_count: int

class SubTopic(BaseModel):
    id: str
    title: str

class TopicSummary(BaseModel):
    id: str
    language_id: str
    category_id: str
    category_name: str
    level: str
    title: str
    difficulty: str
    order: int
    description: str

class TopicDetail(BaseModel):
    id: str
    language_id: str
    language_name: str
    category_id: str
    category_name: str
    level: str
    title: str
    difficulty: str
    order: int
    description: str
    learning_objectives: List[str]
    subtopics: List[str]
    theory: str
    syntax: str
    examples: List[Dict[str, str]]
    common_mistakes: List[Dict[str, str]]
    important_notes: List[str]
    prev_topic_id: Optional[str] = None
    next_topic_id: Optional[str] = None

class WorksheetQuestion(BaseModel):
    id: str
    topic_id: str
    level: str
    type: str
    difficulty: str
    question: str
    options: Optional[List[str]] = None
    answer: str
    hint: str
    explanation: str
    points: int = 5
    starter_code: Optional[str] = None
    test_cases: Optional[List[Dict[str, Any]]] = None

class WorksheetData(BaseModel):
    topic_id: str
    topic_title: str
    language_id: str
    total_questions: int
    total_points: int
    questions: List[WorksheetQuestion]

class WorksheetCheckRequest(BaseModel):
    question_id: str
    topic_id: str
    user_answer: str
    language_id: Optional[str] = "python"

class WorksheetCheckResponse(BaseModel):
    is_correct: bool
    correct_answer: str
    explanation: str
    points_earned: int
    feedback: str
    output: Optional[str] = None

class QuizQuestion(BaseModel):
    id: str
    topic_id: str
    question: str
    code_snippet: Optional[str] = None
    options: List[str]
    correct_index: int
    explanation: str
    points: int = 10

class QuizData(BaseModel):
    topic_id: str
    topic_title: str
    language_id: str
    total_questions: int
    pass_percentage: int = 70
    questions: List[QuizQuestion]

class QuizSubmitRequest(BaseModel):
    topic_id: str
    user_id: str
    answers: Dict[str, int]
    time_taken_seconds: int

class QuizSubmitResponse(BaseModel):
    topic_id: str
    score: int
    total_points: int
    percentage: float
    passed: bool
    correct_count: int
    total_count: int
    detailed_results: List[Dict[str, Any]]

class CompilerExecuteRequest(BaseModel):
    language: str
    code: str
    stdin: Optional[str] = ""

class CompilerExecuteResponse(BaseModel):
    success: bool
    output: str
    error: Optional[str] = None
    execution_time_ms: float
    language: str
    native_supported: bool

class ChallengeTestCase(BaseModel):
    input: str
    expected_output: str
    hidden: bool = False

class Challenge(BaseModel):
    id: str
    title: str
    language: str
    difficulty: str
    category: str
    description: str
    constraints: List[str]
    example_input: str
    example_output: str
    hint: str
    starter_code: str
    test_cases: List[ChallengeTestCase]

class ChallengeRunRequest(BaseModel):
    challenge_id: str
    code: str
    custom_input: Optional[str] = None

class ChallengeSubmitRequest(BaseModel):
    challenge_id: str
    user_id: str
    code: str

class ChallengeSubmitResponse(BaseModel):
    challenge_id: str
    passed: bool
    passed_cases: int
    total_cases: int
    score: int
    results: List[Dict[str, Any]]
    message: str

class InterviewQuestion(BaseModel):
    id: str
    category: str
    language: Optional[str] = None
    difficulty: str
    question: str
    answer: str
    explanation: str
    key_points: List[str]
    company_tags: List[str]

class TopicProgressRequest(BaseModel):
    user_id: str
    topic_id: str
    completed: bool = True

class WorksheetProgressRequest(BaseModel):
    user_id: str
    topic_id: str
    score: int
    percentage: float
    correct: int
    incorrect: int
    time_seconds: int

class UserProgress(BaseModel):
    user_id: str
    overall_percentage: float
    completed_topics_count: int
    total_topics_count: int
    worksheets_completed_count: int
    quizzes_completed_count: int
    average_quiz_score: float
    current_streak_days: int
    total_learning_time_minutes: int
    language_progress: Dict[str, Dict[str, Any]]
    completed_topics: List[str]
    worksheet_scores: Dict[str, Dict[str, Any]]
    quiz_scores: Dict[str, Dict[str, Any]]
    challenge_stats: Dict[str, Any]
    recent_activity: List[Dict[str, Any]]

class SearchResultItem(BaseModel):
    id: str
    type: str
    title: str
    subtitle: str
    category: str
    language: Optional[str] = None
    link: str
