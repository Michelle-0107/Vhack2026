"""
Logger - Structured logging utilities for the VHack engine.
"""
import logging
import sys


def get_logger(name: str) -> logging.Logger:
    """
    Return a configured logger instance.

    Args:
        name: Logger name, typically the module __name__.

    Returns:
        Configured logging.Logger.
    """
    logger = logging.getLogger(name)
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(logging.Formatter(
            "[%(asctime)s] %(levelname)s %(name)s: %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        ))
        logger.addHandler(handler)
        logger.setLevel(logging.DEBUG)
    return logger
