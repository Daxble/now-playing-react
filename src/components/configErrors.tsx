import type { FunctionComponent } from "preact";
import type { ZodIssue } from "zod";

export const ConfigErrors: FunctionComponent<{
  issues: ZodIssue[];
}> = ({ issues }) => {
  return (
    <div className="mocha flex h-screen flex-col items-center justify-center">
      <div className="rounded-md bg-crust p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-mauve">
              There are {issues.length} error(s) with your configuration
            </h3>
            <div className="mt-2 text-sm text-text">
              <ul role="list" className="list-disc pl-5">
                {issues.map((error) => (
                  <li>
                    <p className={"font-bold"}>{error.path}</p>
                    <p>{error.message}</p>
                    <br />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
