from metadata import metadata

def general_dictionary_extract(key, var):
    if hasattr(var, 'items'):
        for k, v in var.items():
            if k == key:
                yield v
            if isinstance(v, dict):
                for result in general_dictionary_extract(key, v):
                    yield result
            elif isinstance(v, list):
                for d in v:
                    for result in general_dictionary_extract(key, d):
                        yield result


def find_key(key):
    md = metadata()
    return list(general_dictionary_extract(key, md))


if __name__ == '__main__':
    key = input("Enter the key name to get the value\n")
    print(find_key(key))