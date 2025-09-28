interface WebResponse<T> {
	code   : number;
	status : string;
	data   : T;
}