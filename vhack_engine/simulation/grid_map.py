"""
Grid Map - Utilities for working with the simulation grid.
Provides sector decomposition and coordinate helpers.
"""


class GridMap:
    """
    Wraps the Mesa MultiGrid with domain-specific helpers for the disaster map.
    """

    def __init__(self, width: int = 20, height: int = 20):
        self.width = width
        self.height = height

    def get_sector(self, x: int, y: int, sector_size: int = 5) -> tuple[int, int]:
        """Return the sector index (col, row) for a grid coordinate."""
        return x // sector_size, y // sector_size

    def get_cells_in_sector(
        self, sector_col: int, sector_row: int, sector_size: int = 5
    ) -> list[tuple[int, int]]:
        """List all (x, y) cells within a given sector."""
        cells = []
        for x in range(sector_col * sector_size, (sector_col + 1) * sector_size):
            for y in range(sector_row * sector_size, (sector_row + 1) * sector_size):
                if x < self.width and y < self.height:
                    cells.append((x, y))
        return cells

    def manhattan_distance(self, a: tuple[int, int], b: tuple[int, int]) -> int:
        """Return Manhattan distance between two grid cells."""
        return abs(a[0] - b[0]) + abs(a[1] - b[1])
