const pick = <T>(obj: T, props: string[]): T =>
  obj &&
  Object.keys(obj).reduce((res, key) => {
    if (~props.indexOf(key)) {
      (res as any)[key] = (obj as any)[key];
    }
    return res;
  }, {} as T);

export default pick;
