"""
Sectors - Divides the disaster map into searchable sectors for systematic coverage.
"""
from dataclasses import dataclass, field


@dataclass
class Sector:
    """A rectangular region of the disaster map assigned to a drone."""

    sector_id: str
    x_min: int
    y_min: int
    x_max: int
    y_max: int
    priority: int = 1
    searched: bool = False
    assigned_drone: str | None = None

    @property
    def cells(self) -> list[tuple[int, int]]:
        """All grid cells within this sector."""
        return [
            (x, y)
            for x in range(self.x_min, self.x_max + 1)
            for y in range(self.y_min, self.y_max + 1)
        ]

    @property
    def center(self) -> tuple[int, int]:
        """Center cell of the sector."""
        return (self.x_min + self.x_max) // 2, (self.y_min + self.y_max) // 2


def divide_into_sectors(width: int, height: int, sector_size: int = 5) -> list[Sector]:
    """Partition a grid of given dimensions into equal-sized sectors."""
    sectors = []
    sid = 0
    for col in range(0, width, sector_size):
        for row in range(0, height, sector_size):
            sectors.append(Sector(
                sector_id=f"S{sid:03d}",
                x_min=col,
                y_min=row,
                x_max=min(col + sector_size - 1, width - 1),
                y_max=min(row + sector_size - 1, height - 1),
            ))
            sid += 1
    return sectors
