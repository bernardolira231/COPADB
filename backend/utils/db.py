import psycopg2
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager
from config.config import Config

@contextmanager
def get_db_connection():
    """
    Contexto para manejar conexiones a la base de datos.
    Garantiza que las conexiones se cierren correctamente después de su uso.
    
    Uso:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM tabla")
                resultados = cur.fetchall()
    """
    conn = None
    try:
        conn = psycopg2.connect(**Config.DB_CONFIG, cursor_factory=RealDictCursor)
        yield conn
        conn.commit()
    except Exception as e:
        if conn:
            conn.rollback()
        raise e
    finally:
        if conn:
            conn.close()
