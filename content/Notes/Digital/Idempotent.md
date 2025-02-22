An Idempotent function is one that can handle being called multiple times when the output is only required once.

For example making a directory will return an error if that directory already exists. An idempotent version would either create the directory if not already created otherwise it will simply verify the existence of that directory.

This can be particularly important when multiple instances of the same code runs multiple times as is common in an a [[Container]] architecture