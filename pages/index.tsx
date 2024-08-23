import clientPromise from "@/lib/mongodb";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";

interface PhoEntry {
  _id: string;
  date: string;
  name: string;
  location: string;
  type: string;
  rating: string;
  price: string;
  notes: string;
}

type ConnectionStatus = {
  isConnected: boolean;
  entries?: PhoEntry[] | null;
};

const currentYear = new Date().getFullYear();

const calculateDaysSince = (date: string) => {
  const lastDate = new Date(date);
  const today = new Date();
  const timeDiff = today.getTime() - lastDate.getTime();
  return Math.floor(timeDiff / (1000 * 3600 * 24));
};

export const getServerSideProps: GetServerSideProps<
  ConnectionStatus
> = async () => {
  try {
    const client = await clientPromise;
    const db = client.db("personal");
    const entries = await db
      .collection("pho-tracker")
      .find({})
      .sort({ date: -1 })
      .limit(20)
      .toArray();

    return {
      props: {
        isConnected: true,
        entries: entries.length ? JSON.parse(JSON.stringify(entries)) : null,
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: {
        isConnected: false,
        entries: null,
      },
    };
  }
};

export default function Home({
  isConnected,
  entries,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!isConnected) {
    return (
      <main className="flex flex-col justify-center items-center min-h-screen bg-black bg-opacity-50 text-white p-4">
        <h1 className="text-center text-3xl font-bold mb-4">
          Could not connect to the database.
        </h1>
        <footer className="text-sm absolute bottom-4 right-4 space-y-2">
          <div>
            Photo by{" "}
            <a
              href="https://unsplash.com/@ruslanbardash?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ruslan Bardash
            </a>{" "}
            on{" "}
            <a
              href="https://unsplash.com/photos/white-house-between-two-cliffs-8MhejqEghLk?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unsplash
            </a>
          </div>
          <div>
            a creation by{" "}
            <a
              className="underline"
              href="https://github.com/kennytrbl"
              target="_blank"
              rel="noopener noreferrer"
            >
              Kenny Zhang
            </a>
            , © {currentYear}
          </div>
        </footer>
      </main>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <main className="flex flex-col justify-center items-center min-h-screen bg-black bg-opacity-50 text-white p-4">
        <h1 className="text-center text-3xl font-bold mb-4">
          No noodle entries found.
        </h1>
        <footer className="text-sm absolute bottom-4 right-4 space-y-2">
          <div>
            Photo by{" "}
            <a
              href="https://unsplash.com/@ruslanbardash?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ruslan Bardash
            </a>{" "}
            on{" "}
            <a
              href="https://unsplash.com/photos/white-house-between-two-cliffs-8MhejqEghLk?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unsplash
            </a>
          </div>
          <div>
            a creation by{" "}
            <a
              className="underline"
              href="https://github.com/kennytrbl"
              target="_blank"
              rel="noopener noreferrer"
            >
              Kenny Zhang
            </a>
            , © {currentYear}
          </div>
        </footer>
      </main>
    );
  }

  const mostRecentDate = entries[0]?.date || "";
  const daysSinceMostRecent = calculateDaysSince(mostRecentDate);

  return (
    <main className="flex flex-col items-center min-h-screen bg-black bg-opacity-50 text-white p-4 relative">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl mt-6 text-center">Noodle Tracker</h1>
        <h2 className="text-2xl mb-6 text-center">
          It has been {daysSinceMostRecent} days since I have eaten noodles.
        </h2>
        <table className="w-full border-collapse bg-white text-gray-900 shadow-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="date py-2 px-4 border-b text-left">Date</th>
              <th className="name py-2 px-4 border-b text-left">Name</th>
              <th className="location py-2 px-4 border-b text-left">
                Location
              </th>
              <th className="type py-2 px-4 border-b text-left">Type</th>
              <th className="rating py-2 px-4 border-b text-left">Rating</th>
              <th className="price py-2 px-4 border-b text-left">Price</th>
              <th className="notes py-2 px-4 border-b text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry._id}>
                <td className="date py-2 px-4 border-b">
                  {entry.date.replace("T00:00:00.000Z", "")}
                </td>
                <td className="name py-2 px-4 border-b">{entry.name}</td>
                <td className="location py-2 px-4 border-b">
                  {entry.location}
                </td>
                <td className="type py-2 px-4 border-b">{entry.type}</td>
                <td className="rating py-2 px-4 border-b">{entry.rating}</td>
                <td className="price py-2 px-4 border-b">{entry.price}</td>
                <td className="notes py-2 px-4 border-b">{entry.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer className="text-sm absolute bottom-4 right-4 space-y-2">
        <div>
          Photo by{" "}
          <a
            href="https://unsplash.com/@ruslanbardash?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ruslan Bardash
          </a>{" "}
          on{" "}
          <a
            href="https://unsplash.com/photos/white-house-between-two-cliffs-8MhejqEghLk?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Unsplash
          </a>
        </div>
        <div>
          a creation by{" "}
          <a
            className="underline"
            href="https://github.com/kennytrbl"
            target="_blank"
            rel="noopener noreferrer"
          >
            Kenny Zhang
          </a>
          , © {currentYear}
        </div>
      </footer>
    </main>
  );
}
