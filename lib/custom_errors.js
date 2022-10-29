// First, we'll create some custom error types by extending `Error.prototype`
// This is simplest with ES6 class syntax. We'll set `name` and `message` in
// the constructor method of each custom error type to match the pattern that
// Express and Mongoose use for custom errors.

class OwnershipError extends Error {
	constructor() {
		super()
		this.name = 'OwnershipError'
		this.message =
			'The provided token does not match the owner of this document'
	}
}

class DocumentNotFoundError extends Error {
	constructor() {
		super()
		this.name = 'DocumentNotFoundError'
		this.message = "The provided ID doesn't match any documents"
	}
}

class BadParamsError extends Error {
	constructor() {
		super()
		this.name = 'BadParamsError'
		this.message = 'A required parameter was omitted or invalid'
	}
}

class BadCredentialsError extends Error {
	constructor() {
		super()
		this.name = 'BadCredentialsError'
		this.message = 'The provided username or password is incorrect'
	}
}

// this method checks if the user trying to modify a resource is the owner of
// resource, and throws an error if not

// `requestObject` should be the actual `req` object from the route file
const requireOwnership = (requestObject, resource) => {
	// `requestObject.user` will be defined in any route that uses `requireToken`
	// `requireToken` MUST be passed to the route as a second argument
	const owner = resource.owner._id ? resource.owner._id : resource.owner
	//  check if the resource.owner is an object in case populate is being used
	//  if it is, use the `_id` property and if not, just use its value
	if (!requestObject.user._id.equals(owner)) {
		throw new OwnershipError()
	}
}

// this method checks if the user trying to alter a subdocument is EITHER the subdocument's owner or the document's owner. For our purposes, we will allow the document (activity) owner delete privileges over subdocuments (notes) they are not the owner of

const requireSubOrDocOwnership = (requestObject, subDocument, document) => {
	//define doc and subdoc owners using either their ids or owner objects themselves
	const docOwner = document.owner._id ? document.owner._id : document.owner
	const subDocOwner = subDocument.owner._id ? subDocument.owner._id : subDocument.owner
	//if requesting user is neither the doc owner nor subdoc owner, throw ownership error
	if (!(requestObject.user._id.equals(docOwner) || requestObject.user._id.equals(subDocOwner))) {
		throw new OwnershipError()
	}
}


// if the client passes an ID that isn't in the DB, we want to return 404
const handle404 = (record) => {
	if (!record) {
		throw new DocumentNotFoundError()
	} else {
		return record
	}
}

module.exports = {
	requireOwnership,
	requireSubOrDocOwnership,
	handle404,
	BadParamsError,
	BadCredentialsError,
}
