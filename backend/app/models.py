from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from pgvector.sqlalchemy import Vector



Base = declarative_base()

# FOR EMBEDDING MODEL #
N_DIM = 768

# class CensusTablePointer(Base):
#     """
#     A class representing a certain table in the census database.
#     Used to get most relevant data table from the Cencus database according to the user query.
#     text_embedding is the embedded text of the table summary provided by the census database.
#     A list of Tables and their corresponding attributes I used can be found here 
#     """
#     __tablename__ = "text_embeddings"

#     id = Column(Integer, primary_key=True, autoincrement=True)
#     filename = Column(String, nullable=False)  
#     text = Column(String, nullable=False)
#     embedding = Column(Vector(N_DIM))
#     email_account_id = Column(Integer, ForeignKey("email_accounts.id", ondelete="CASCADE"), nullable=False)
#     file_id = Column(Integer, ForeignKey("files.id", ondelete="CASCADE"), nullable=False)  #Duplicat ? since we can access fil_id from TextEmbedding.file.id

#     # Relationships
#     email_account = relationship("EmailAccount", back_populates="embeddings")
#     file = relationship("DBFile", back_populates="embeddings")

#     def as_dict(self):
#         return {
#             "id": self.id,
#             "email_account_id": self.email_account_id,
#             "filename": self.filename,
#             "embedding": self.embedding,
#         }