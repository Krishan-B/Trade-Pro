export function assertStorageSuccess(result) {
    expect(result.error).toBeNull();
    expect(result.data).not.toBeNull();
}
