export function getRovingRadioGroupNextIndex(
  key: string,
  currentIndex: number,
  itemCount: number
): number | null {
  if (itemCount <= 0 || currentIndex < 0) {
    return null;
  }

  if (key === 'ArrowRight' || key === 'ArrowDown') {
    return (currentIndex + 1) % itemCount;
  }

  if (key === 'ArrowLeft' || key === 'ArrowUp') {
    return (currentIndex - 1 + itemCount) % itemCount;
  }

  return null;
}
