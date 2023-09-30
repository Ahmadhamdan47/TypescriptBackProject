## RTK Queries API

This directory contains the RTK Query API definition.<br>
All could have been in the same file, but we prefer to separate them.
```globalApi.ts``` is some sort of empty shell, containing the connection parameters to access the back-end. It is included in the store definition.<br>
Other files are separated requests definitions, and they inject their endpoints in the global API. Includes in files that need to perform the requests they define are much clearer (eg: including usersApiSlice in users components).