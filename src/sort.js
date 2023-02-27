function min(a, b) {
  return a < b ? a : b;
}

function merge(dst, src, srcIndex, srcEnd, width, comparator) {
  var left = srcIndex;
  var leftEnd = min(left + width, srcEnd);
  var right = leftEnd;
  var rightEnd = min(right + width, srcEnd);

  for (var dstIndex = left; dstIndex < rightEnd; ++dstIndex) {
    if (right < rightEnd) {
      if (left >= leftEnd || comparator(src[right], src[left]) < 0) {
        dst[dstIndex] = src[right++];
        continue;
      }
    }

    dst[dstIndex] = src[left++];
  }
}

export function mergeSort(array, comparator) {
  var buffer = [];
  const valueCount = array.length;
  buffer.length = valueCount;

  var dst = buffer;
  var src = array;
  for (var width = 1; width < valueCount; width *= 2) {
    for (var srcIndex = 0; srcIndex < valueCount; srcIndex += 2 * width)
      merge(dst, src, srcIndex, valueCount, width, comparator);

    var tmp = src;
    src = dst;
    dst = tmp;
  }

  if (src != array) {
    for (var i = 0; i < valueCount; i++)
      array[i] = src[i];
  }

  return array;
}