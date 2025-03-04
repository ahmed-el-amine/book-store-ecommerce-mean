async function usePromise(promiseFn) {
  try {
    const data = await promiseFn();
    return [null, data];
  } catch (err) {
    return [err, null];
  }
}

export default usePromise;
